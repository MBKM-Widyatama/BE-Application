import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { RolesService } from 'src/models/roles/services/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('master-roles')
export class MasterRolesController {
  constructor(private readonly RolesService: RolesService) {}

  @Post()
  @HttpCode(201)
  @Throttle(3, 60)
  async create(@Body() body: CreateRoleDto) {
    const result = await this.RolesService.createRole(body);

    return {
      message: 'Role created successfully',
      result,
    };
  }
}
