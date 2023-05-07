import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacultiesEntity } from '../entities/faculties.entity';
import { ICreateFaculty } from '../interfaces/faculties.interface';
import { ListOptionDto, PageMetaDto, PaginateDto } from 'src/libraries/common';
import { getSortColumns } from 'src/libraries/common/helpers';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectRepository(FacultiesEntity)
    private readonly FacultiesRepository: Repository<FacultiesEntity>,
  ) {}

  /**
   * @description Handle find all faculties
   * @param {string} name
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
   * @description Handle find faculty by name
   * @param {string} name
   * @returns {Promise<FacultiesEntity>}
   */
  findFacultyByName(name: string): Promise<FacultiesEntity> {
    return this.FacultiesRepository.findOne({ where: { name } });
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
}
