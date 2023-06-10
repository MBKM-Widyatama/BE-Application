import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { CategorialNewsEntity } from '../entities/categorial-news.entity';
import { ListOptionDto, PageMetaDto, PaginateDto } from 'src/libraries/common';
import { getSortColumns } from 'src/libraries/common/helpers';
import { IResultFilters } from 'src/libraries/common/interfaces';
import {
  CreateCategorialNewsDto,
  UpdateCategorialNewsDto,
} from 'src/services/master-categorial-news/dtos';

@Injectable()
export class CategorialNewsService {
  constructor(
    @InjectRepository(CategorialNewsEntity)
    private readonly CategorialNewsRepository: Repository<CategorialNewsEntity>,
    private readonly DataSource: DataSource,
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

  /**
   * @description Handle create data categorial news
   * @param {Object} payload @type CreateCategorialNewsDto
   *
   * @return {Promise<CategorialNewsEntity>}
   */
  async createCategorialNews(
    payload: CreateCategorialNewsDto,
  ): Promise<CategorialNewsEntity> {
    try {
      const categorialNews = this.CategorialNewsRepository.create(payload);
      await this.CategorialNewsRepository.save(categorialNews);

      return await this.findCategorialNewsById(categorialNews.id);
    } catch (error) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle update data categorial news
   * @param {string} id
   * @param {Object} payload @type UpdateCategorialNewsDto
   *
   * @return {Promise<CategorialNewsEntity>}
   */
  async updateCategorialNews(
    id: string,
    payload: UpdateCategorialNewsDto,
  ): Promise<CategorialNewsEntity> {
    // Make sure if categorial news exist
    const categorialNews = await this.findCategorialNewsById(id);

    try {
      await this.DataSource.transaction(async (manager: EntityManager) => {
        this.CategorialNewsRepository.merge(categorialNews, payload);
        await manager.save(categorialNews);
      });

      return await this.findCategorialNewsById(categorialNews.id);
    } catch (error) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle delete data categorial news
   * @param {string} id
   *
   * @return {Promise<CategorialNewsEntity>}
   */
  async deleteCategorialNews(id: string): Promise<CategorialNewsEntity> {
    try {
      const categorialNews = await this.findCategorialNewsById(id);
      const deletedAt = Math.floor(Date.now() / 1000);
      this.CategorialNewsRepository.merge(categorialNews, {
        deleted_at: deletedAt,
      });

      await this.CategorialNewsRepository.save(categorialNews);

      return await this.findCategorialNewsById(categorialNews.id);
    } catch (error) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle restore data categorial news
   * @param {string} id
   *
   * @return {Promise<CategorialNewsEntity>}
   */
  async restoreCategorialNews(id: string): Promise<CategorialNewsEntity> {
    try {
      const categorialNews = await this.findCategorialNewsById(id);
      this.CategorialNewsRepository.merge(categorialNews, {
        deleted_at: null,
      });

      await this.CategorialNewsRepository.save(categorialNews);

      return await this.findCategorialNewsById(categorialNews.id);
    } catch (error) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }
}
