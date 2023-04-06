import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '../entities/roles.entity';
import { CreateRoleDto } from 'src/services/master-roles/dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly RolesRepository: Repository<Roles>,
  ) {}

  /**
   * @description Handle find all roles
   *
   * @returns {Promise<Roles[]>}
   */
  findAllRoles(): Promise<Roles[]> {
    return this.RolesRepository.find();
  }

  /**
   * @description Handle find role by name
   * @param {string} name
   * @returns {Promise<Roles>}
   */
  findRoleByName(name: string): Promise<Roles> {
    return this.RolesRepository.findOne({ where: { name } });
  }

  /**
   * @description Handle create role
   * @param {Object} payload
   *
   * @returns {Promise<Roles>}
   */
  createRole(payload: CreateRoleDto): Promise<Roles> {
    const role = this.RolesRepository.create(payload);

    return this.RolesRepository.save(role);
  }
}
