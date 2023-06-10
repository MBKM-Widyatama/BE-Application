import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource as Source,
  EntityManager,
  SelectQueryBuilder,
  Repository,
} from 'typeorm';
import { NewsEntity } from '../entities/news.entity';
import { ListOptionDto, PageMetaDto, PaginateDto } from 'src/libraries/common';
import { getSortColumns } from 'src/libraries/common/helpers';
import { IResultFilters } from 'src/libraries/common/interfaces';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly NewsRepository: Repository<NewsEntity>,
    private readonly DataSource: Source,
  ) {}

  /**
   * @description Handle filters data
   * @param {Object} filters @type ListOptionDto
   * @param {SelectQueryBuilder<NewsEntity>}  query
   *
   * @returns {Promise<IResultFilters>}
   */
  private async filtersData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<NewsEntity>,
  ): Promise<IResultFilters> {
    try {
      // Has relationships
      query.leftJoinAndSelect('news.user', 'user');
      // query.leftJoinAndSelect('news.categories', 'categories');

      if (filters.search) {
        query.andWhere(
          'news.title ILIKE :search OR news.content ILIKE :search',
          {
            search: `%${filters.search}%`,
          },
        );
      }

      if (filters.isDeleted) {
        query.andWhere('news.deleted_at IS NOT NULL');
      } else {
        query.andWhere('news.deleted_at IS NULL');
      }

      if (filters.sort) {
        const orderBy = getSortColumns(filters.sort);
        query.orderBy(orderBy);
      }

      if (!filters.disablePaginate) {
        query.limit(filters.limit);
        query.offset(filters.skip);
      }

      const [data, totalData] = await query.cache(true).getManyAndCount();
      const total = data.length;

      return {
        data,
        total,
        totalData,
      };
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle find all news
   * @param {Object} filters @type ListOptionDto
   *
   * @returns {Promise<PaginateDto<NewsEntity>>}
   */
  async findAllNews(filters: ListOptionDto): Promise<PaginateDto<NewsEntity>> {
    try {
      const query: SelectQueryBuilder<NewsEntity> =
        this.NewsRepository.createQueryBuilder('news');
      const { data, total, totalData } = await this.filtersData(filters, query);
      const meta = new PageMetaDto({
        totalData,
        total,
        page: filters.offset,
        size: filters.disablePaginate ? totalData : filters.limit,
      });

      return new PaginateDto<NewsEntity>(data, meta);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle find news by id
   * @param {string} id
   *
   * @returns {Promise<NewsEntity>}
   */
  async findNewsById(id: string): Promise<NewsEntity> {
    try {
      return await this.NewsRepository.findOne({
        where: {
          id,
        },
        relations: ['user', 'categories'],
      });
    } catch (error) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }
}
