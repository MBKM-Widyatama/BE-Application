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
import { FacultiesEntity } from '../entities/faculties.entity';
import { ICreateFaculty } from '../interfaces/faculties.interface';
import {
  ListOptionDto,
  PageMetaDto,
  PaginateDto,
  getSortColumns,
  IRequestUser,
} from 'src/libraries/common';
import { UpdateFacultyDto } from 'src/services/master-faculties/dtos/update-faculty.dto';
import { IResultFilters } from 'src/libraries/common/interfaces';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectRepository(FacultiesEntity)
    private readonly FacultiesRepository: Repository<FacultiesEntity>,
    private readonly DataSource: Source,
  ) {}

  /**
   * @description Handle filters data
   * @param {Object} filters ListOptionDto
   * @param {SelectQueryBuilder<FacultiesEntity>}  query
   *
   * @returns {Promise<IResultFilters>}
   */
  private async filtersData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<FacultiesEntity>,
  ): Promise<IResultFilters> {
    try {
      // Has relationships
      query.leftJoinAndSelect('faculties.leader', 'leader');
      // query.leftJoinAndSelect('faculties.lecturer', 'lecturer');

      if (filters.search) {
        query.andWhere('faculties.name ILIKE :search', {
          search: `%${filters.search}%`,
        });
      }

      if (filters.isDeleted) {
        query.andWhere('faculties.deleted_at IS NOT NULL');
      } else {
        query.andWhere('faculties.deleted_at IS NULL');
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
   * @description Handle find all faculties
   * @param {filters} ListOptionDto
   * @returns {Promise<FacultiesEntity[]>}
   */
  async findAllFaculties(
    filters: ListOptionDto,
  ): Promise<PaginateDto<FacultiesEntity>> {
    try {
      const query: SelectQueryBuilder<FacultiesEntity> =
        this.FacultiesRepository.createQueryBuilder('faculties');
      const { data, total, totalData } = await this.filtersData(filters, query);
      const meta = new PageMetaDto({
        totalData,
        total,
        page: filters.offset,
        size: filters.disablePaginate ? totalData : filters.limit,
      });

      return new PaginateDto<FacultiesEntity>(data, meta);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle find faculty by id
   * @param {string} id
   *
   * @returns {Promise<FacultiesEntity>}
   */
  async findFacultyById(id: string): Promise<FacultiesEntity> {
    try {
      return await this.FacultiesRepository.findOne({
        where: {
          id,
        },
        relations: ['leader'],
      });
    } catch (err) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: err.response ? err?.response?.error : err.message,
      });
    }
  }

  /**
   * @description Handle create faculty
   * @param {Object} payload
   * @param {Object} user @type IRequestUser
   *
   * @returns {Promise<FacultiesEntity>}
   */
  async createFaculty(
    payload: ICreateFaculty,
    user: IRequestUser,
  ): Promise<FacultiesEntity> {
    try {
      const role = this.FacultiesRepository.create(payload);

      return this.FacultiesRepository.save(role, {
        data: {
          action: 'CREATE',
          user,
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
   * @description Handle update faculty
   * @param {string} id
   * @requestBody {Object} payload
   *
   * @returns {Promise<FacultiesEntity>}
   */
  async updateFaculty(id: string, payload: UpdateFacultyDto): Promise<any> {
    const faculty = await this.FacultiesRepository.findOneOrFail({
      where: {
        id,
      },
    });

    try {
      await this.DataSource.transaction(async (manager: EntityManager) => {
        this.FacultiesRepository.merge(faculty, payload);
        await manager.save(faculty, { data: { action: 'UPDATE' } });
      });

      return await this.findFacultyById(id);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle delete faculty
   * @param {string} id
   *
   * @returns {Promise<FacultiesEntity>}
   */
  async deleteFaculty(id: string): Promise<FacultiesEntity> {
    try {
      const faculty = await this.findFacultyById(id);
      const deletedAt = Math.floor(Date.now() / 1000);

      this.FacultiesRepository.merge(faculty, faculty, {
        deleted_at: deletedAt,
      });
      return await this.FacultiesRepository.save(faculty, {
        data: { action: 'DELETE' },
      });
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle restore faculty
   * @param {string} id
   *
   * @returns {Promise<FacultiesEntity>}
   */
  async restoreFaculty(id: string): Promise<FacultiesEntity> {
    try {
      const faculty = await this.findFacultyById(id);

      this.FacultiesRepository.merge(faculty, {
        deleted_at: null,
      });

      return await this.FacultiesRepository.save(faculty, {
        data: { action: 'RESTORE' },
      });
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }
}
