import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CoursesEntity } from '../entities/courses.entity';
import { getSortColumns } from 'src/libraries/common/helpers';
import { ListOptionDto, PageMetaDto, PaginateDto } from 'src/libraries/common';
import { CreateUpdateCourseDto } from 'src/services/master-courses/dtos';

@Injectable()
export class CoursesService {
  private readonly CoursesModel = new CoursesEntity();

  constructor(
    @InjectRepository(CoursesEntity)
    private readonly CoursesRepository: Repository<CoursesEntity>,
  ) {}

  /**
   * @description Handle filters data
   * @param {Object} filters ListOptionDto
   * @param {SelectQueryBuilder<CoursesEntity>} query
   *
   * @returns {Promise<IResultFilters>}
   */
  private async filtersData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<CoursesEntity>,
  ) {
    // Has relations
    // query.leftJoinAndSelect('courses.leader', 'leader');

    try {
      if (filters.search) {
        query.andWhere('courses.name ILIKE :search', {
          search: `%${filters.search}%`,
        });
      }

      if (filters.isDeleted) {
        query.andWhere('courses.deleted_at IS NOT NULL');
      } else {
        query.andWhere('courses.deleted_at IS NULL');
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
   * @description Handle get all courses
   * @param {ListOptionDto} filters
   *
   * @returns {Promise<PaginateDto<CoursesEntity>>}
   */
  async findAllCourses(
    filters: ListOptionDto,
  ): Promise<PaginateDto<CoursesEntity>> {
    try {
      const query: SelectQueryBuilder<CoursesEntity> =
        this.CoursesRepository.createQueryBuilder('courses');
      const { data, total, totalData } = await this.filtersData(filters, query);
      const meta = new PageMetaDto({
        totalData,
        total,
        page: filters.offset,
        size: filters.disablePaginate ? totalData : filters.limit,
      });

      return new PaginateDto<CoursesEntity>(data, meta);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle get course by id
   * @param {string} id
   *
   * @returns {Promise<CoursesEntity>}
   */
  async findCourseById(id: string): Promise<CoursesEntity> {
    try {
      return await this.CoursesRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle create course
   * @param {Object} payload @type CreateUpdateCourseDto
   *
   * @return {Promise<CoursesEntity>}
   */
  async createCourses(payload: CreateUpdateCourseDto): Promise<CoursesEntity> {
    const course = this.CoursesRepository.create(payload);

    return await this.CoursesRepository.save(course);
  }

  /**
   * @description Handle update course
   * @param {string} id
   * @param {Object} payload @type CreateUpdateCourseDto
   *
   * @return {Promise<CoursesEntity>}
   */
  async updateCourses(
    id: string,
    payload: CreateUpdateCourseDto,
  ): Promise<any> {
    try {
      await this.findCourseById(id);

      return await this.CoursesRepository.update(id, payload);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }
}
