import * as fs from 'fs';
import * as path from 'path';
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
import { generateFileName, getSortColumns } from 'src/libraries/common/helpers';
import { IRequestUser, IResultFilters } from 'src/libraries/common/interfaces';
import { CreateNewsDto } from 'src/services/master-news/dtos/create-news.dto';
import { UpdateNewsDto } from 'src/services/master-news/dtos/update-news.dto';

@Injectable()
export class NewsService {
  private readonly uploadDirectory =
    __dirname + ' ../../../../../src/libraries/uploads';
  private readonly prefix = 'news';

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
      query.leftJoinAndSelect('news.categories', 'categories');

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
        relations: ['categories'],
      });
    } catch (error) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle create news
   * @param {Object} payload @type CreateNewsDto
   * @param {Object} user @type IRequestUser
   *
   * @returns {Promise<NewsEntity>}
   */
  async createNews(
    file: Express.Multer.File,
    payload: CreateNewsDto,
    user: IRequestUser,
  ): Promise<NewsEntity> {
    let result: NewsEntity;
    let thumbnail;

    if (file) {
      // Create directory if not exist
      if (!fs.existsSync(`${this.uploadDirectory}/${this.prefix}`)) {
        fs.mkdirSync(`${this.uploadDirectory}/${this.prefix}`, {
          recursive: true,
        });
      }

      const filename = generateFileName(file[0]);
      const filePath = path.join(
        `${this.uploadDirectory}/${this.prefix}`,
        filename,
      );
      fs.writeFileSync(filePath, file[0].buffer);
      thumbnail = `${this.prefix}/${filename}`;
    }

    try {
      await this.DataSource.transaction(async (manager: EntityManager) => {
        // Create a new entity of currency and save it into database
        result = this.NewsRepository.create({
          ...payload,
          thumbnail,
        });
        await manager.save(result, {
          data: {
            action: 'CREATE',
            user,
          },
        });
      });

      return await this.findNewsById(result.id);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle update news
   * @param {string} id
   * @param {Object} payload @type UpdateNewsDto
   * @param {Object} user @type IRequestUser
   *
   * @returns {Promise<NewsEntity>}
   */
  async updateNews(
    id: string,
    file: Express.Multer.File,
    payload: UpdateNewsDto,
    user: IRequestUser,
  ): Promise<NewsEntity> {
    let thumbnail;

    try {
      await this.DataSource.transaction(async (manager: EntityManager) => {
        // Make sure that the news is exist
        const news = await this.NewsRepository.findOneOrFail({
          where: {
            id,
          },
        });

        if (file) {
          // If news has thumbnail, then delete it
          if (news.thumbnail) {
            const filePath = path.join(
              `${this.uploadDirectory}/${news.thumbnail}`,
            );
            fs.unlinkSync(filePath);
          }

          // Create directory if not exist
          if (!fs.existsSync(`${this.uploadDirectory}/${this.prefix}`)) {
            fs.mkdirSync(`${this.uploadDirectory}/${this.prefix}`, {
              recursive: true,
            });
          }

          const filename = generateFileName(file[0]);
          const filePath = path.join(
            `${this.uploadDirectory}/${this.prefix}`,
            filename,
          );
          fs.writeFileSync(filePath, file[0].buffer);
          thumbnail = `${this.prefix}/${filename}`;
        }

        // Merge Two Entity into single one and save it
        this.NewsRepository.merge(news, {
          ...payload,
          thumbnail,
        });
        await manager.save(news, {
          data: {
            action: 'UPDATE',
            user,
          },
        });
      });

      return await this.findNewsById(id);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }
}
