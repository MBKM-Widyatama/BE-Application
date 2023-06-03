import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CategorialNewsEntity } from '../entities/categorial-news.entity';
import { ListOptionDto, PageMetaDto, PaginateDto } from 'src/libraries/common';
import { getSortColumns } from 'src/libraries/common/helpers';
import { IResultFilters } from 'src/libraries/common/interfaces';

@Injectable()
export class CategorialNewsService {
  constructor(
    @InjectRepository(CategorialNewsEntity)
    private readonly CategorialNewsRepository: Repository<CategorialNewsEntity>,
  ) {}

  /**
   * @description Handle filters data
   * @param {Object} filters ListOptionDto
   * @param {SelectQueryBuilder<CategorialNewsEntity>} query
   *
   * @returns {Promise<IResultFilters>}
   */
  private async filtersData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<CategorialNewsEntity>,
  ): Promise<IResultFilters> {
    try {
      if (filters.search) {
        query.andWhere('categorialNews.name ILIKE :search', {
          search: `%${filters.search}%`,
        });
      }

      if (filters.isDeleted) {
        query.andWhere('categorialNews.deleted_at IS NOT NULL');
      } else {
        query.andWhere('categorialNews.deleted_at IS NULL');
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
   * @description Handle get all data
   * @param {Object} filters @type ListOptionDto
   *
   * @returns {Promise<PaginateDto<CategorialNewsEntity>>}
   */
  public async findAllCategorialNews(
    filters: ListOptionDto,
  ): Promise<PaginateDto<CategorialNewsEntity>> {
    try {
      const query: SelectQueryBuilder<CategorialNewsEntity> =
        this.CategorialNewsRepository.createQueryBuilder('categorialNews');
      const { data, total, totalData } = await this.filtersData(filters, query);
      const meta = new PageMetaDto({
        totalData,
        total,
        page: filters.offset,
        size: filters.disablePaginate ? totalData : filters.limit,
      });

      return new PaginateDto<CategorialNewsEntity>(data, meta);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle get data by id
   * @param {string} id
   *
   * @returns {Promise<CategorialNewsEntity>}
   */
  public async findCategorialNewsById(
    id: string,
  ): Promise<CategorialNewsEntity> {
    try {
      return await this.CategorialNewsRepository.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }
}
