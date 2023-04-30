import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacultiesEntity } from '../entities/faculties.entity';
import { ICreateFaculty } from '../interfaces/faculties.interface';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectRepository(FacultiesEntity)
    private readonly FacultiesRepository: Repository<FacultiesEntity>,
  ) {}

  /**
   * @description Handle find all faculties
   *
   * @returns {Promise<FacultiesEntity[]>}
   */
  findAllFaculties(): Promise<FacultiesEntity[]> {
    return this.FacultiesRepository.find();
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
