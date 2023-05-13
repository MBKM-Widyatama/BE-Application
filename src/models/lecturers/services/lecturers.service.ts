import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { LecturerEntity } from '../entities/lecturers.entity';
import { ListOptionDto, PageMetaDto, PaginateDto } from 'src/libraries/common';
import { getSortColumns } from 'src/libraries/common/helpers';
import { ICreateLecturer } from '../interfaces/lecturer.interface';

@Injectable()
export class LecturersService {
  private readonly LecturerModel = new LecturerEntity();

  constructor(
    @InjectRepository(LecturerEntity)
    private readonly LecturerRepository: Repository<LecturerEntity>,
  ) {}

  /**
   * @description Handle filter data
   * @param {Object} filters @type ListOptionDto
   *
   * @returns {Promise<Object>}
   */
  private async filterData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<LecturerEntity>,
  ) {
    try {
      // Query has relation
      query.leftJoinAndSelect('lecturer.faculty', 'faculties');

      if (filters.search) {
        query.andWhere('lecturer.name LIKE :search', {
          search: `%${filters.search}%`,
        });
      }

      if (filters.isDeleted) {
        query.andWhere('lecturer.deleted_at IS NOT NULL');
      } else {
        query.andWhere('lecturer.deleted_at IS NULL');
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
   * @description Handle find all lecturers
   * @param {Object} filters @type ListOptionDto
   *
   * @return {Promise<PaginateDto<LecturerEntity>>}
   */
  async findAllLecturers(
    filters: ListOptionDto,
  ): Promise<PaginateDto<LecturerEntity>> {
    try {
      const query: SelectQueryBuilder<LecturerEntity> =
        this.LecturerRepository.createQueryBuilder('lecturer');

      const { data, total, totalData } = await this.filterData(filters, query);
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
   * @description Handle find lecturer by id
   * @param {string} id
   *
   * @return {Promise<LecturerEntity>}
   */
  async findLecturerById(id: string): Promise<LecturerEntity> {
    try {
      return await this.LecturerRepository.findOne({
        where: { id },
        relations: ['faculty'],
      });
    } catch (error) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle create lecturer
   * @param {Object} payload
   *
   * @returns {Promise<LecturerEntity>}
   */
  createLecturer(payload: ICreateLecturer): Promise<LecturerEntity> {
    const lecturer = this.LecturerRepository.create(payload);

    return this.LecturerRepository.save(lecturer);
  }

  /**
   * @description Handle update lecturer
   * @param {string} id
   * @param {Object} payload
   *
   * @returns {Promise<LecturerEntity>}
   */
  async updateLecturer(id: string, payload: ICreateLecturer): Promise<any> {
    try {
      await this.findLecturerById(id);
      await this.LecturerRepository.update(id, payload);

      return await this.findLecturerById(id);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle delete lecturer
   * @param {string} id
   *
   * @returns {Promise<LecturerEntity>}
   */
  async deleteLecturer(id: string): Promise<LecturerEntity> {
    try {
      const lecturer = await this.findLecturerById(id);
      const deletedAt = Math.floor(Date.now() / 1000);

      this.LecturerRepository.merge(lecturer, { deleted_at: deletedAt });

      return await this.LecturerRepository.save(lecturer);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle restore lecturer
   * @param {string} id
   *
   * @returns {Promise<LecturerEntity>}
   */
  async restoreLecturer(id: string): Promise<LecturerEntity> {
    try {
      const lecturer = await this.findLecturerById(id);
      this.LecturerRepository.merge(lecturer, { deleted_at: null });

      return await this.LecturerRepository.save(lecturer);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }
}
