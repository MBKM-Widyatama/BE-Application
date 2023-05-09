import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacultiesEntity } from '../entities/faculties.entity';
import { ICreateFaculty } from '../interfaces/faculties.interface';
import { ListOptionDto, PageMetaDto, PaginateDto } from 'src/libraries/common';
import { getSortColumns } from 'src/libraries/common/helpers';
import { UpdateFacultyDto } from 'src/services/master-faculties/dtos/update-faculty.dto';

@Injectable()
export class FacultiesService {
  private readonly FacultiesModel = new FacultiesEntity();

  constructor(
    @InjectRepository(FacultiesEntity)
    private readonly FacultiesRepository: Repository<FacultiesEntity>,
  ) {}

  /**
   * @description Handle find faculty by id
   * @param {string} id
   *
   * @returns {Promise<FacultiesEntity>}
   */
  async findFacultyById(id: string): Promise<FacultiesEntity> {
    try {
      return await this.FacultiesRepository.findOneBy({
        id,
      });
    } catch (err) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: err.response ? err?.response?.error : err.message,
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
      const query = this.FacultiesRepository.createQueryBuilder(
        'faculties',
      ).select([
        'faculties.id',
        'faculties.name',
        'faculties.leader_id',
        'faculties.created_at',
        'faculties.updated_at',
        'faculties.deleted_at',
      ]);

      if (filters.search) {
        query.andWhere('faculties.name LIKE :search', {
          search: `%${filters.search}%`,
        });
      }

      if (filters.isDeleted) {
        query.andWhere('deleted_at IS NOT NULL');
      } else {
        query.andWhere('deleted_at IS NULL');
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
      const meta = new PageMetaDto({
        totalData,
        total,
        page: filters.offset,
        size: filters.disablePaginate ? totalData : filters.limit,
      });

      return new PaginateDto(data, meta);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle create faculty
   * @param {Object} payload
   *
   * @returns {Promise<FacultiesEntity>}
   */
  createFaculty(payload: ICreateFaculty): Promise<FacultiesEntity> {
    const role = this.FacultiesRepository.create(payload);

    return this.FacultiesRepository.save(role);
  }

  /**
   * @description Handle update faculty
   * @param {string} id
   * @requestBody {Object} payload
   *
   * @returns {Promise<FacultiesEntity>}
   */
  async updateFaculty(id: string, payload: UpdateFacultyDto): Promise<any> {
    try {
      this.findFacultyById(id);

      await this.FacultiesRepository.update(id, payload);
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

      this.FacultiesRepository.merge(this.FacultiesModel, faculty, {
        deleted_at: deletedAt,
      });
      return await this.FacultiesRepository.save(this.FacultiesModel, {
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

      this.FacultiesRepository.merge(this.FacultiesModel, faculty);
      return await this.FacultiesRepository.save(this.FacultiesModel, {
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
