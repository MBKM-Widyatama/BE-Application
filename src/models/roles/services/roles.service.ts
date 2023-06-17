import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../entities/roles.entity';
import { CreateRoleDto } from 'src/services/master-roles/dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly RolesRepository: Repository<RoleEntity>,
  ) {}

  /**
   * @description Handle find all roles
   *
   * @returns {Promise<RoleEntity[]>}
   */
  findAllRoles(): Promise<RoleEntity[]> {
    return this.RolesRepository.find();
  }

  /**
   * @description Handle find role by name
   * @param {string} name
   * @returns {Promise<RoleEntity>}
   */
  findRoleByName(name: string): Promise<RoleEntity> {
    return this.RolesRepository.findOne({ where: { name } });
  }

  /**
   * @description Handle create role
   * @param {Object} payload
   *
   * @returns {Promise<RoleEntity>}
   */
  async createRole(payload: CreateRoleDto): Promise<RoleEntity> {
    try {
      const role = this.RolesRepository.create(payload);

      return await this.RolesRepository.save(role);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }
}
