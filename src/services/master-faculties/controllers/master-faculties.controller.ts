import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { CreateFacultyDto } from '../dtos/create-faculty.dto';
import { FacultiesService } from 'src/models/faculties/services/faculties.service';
import { Throttle } from '@nestjs/throttler';
import { AuthenticationJWTGuard, RolesGuard } from 'src/libraries/common';
import { Roles } from 'src/libraries/decorators';
import { Role } from 'src/libraries/common/enums';

@Controller('master-faculties')
@UseGuards(AuthenticationJWTGuard, RolesGuard)
@Roles(Role.SuperAdmin)
export class MasterFacultiesController {
  constructor(private readonly FacultiesService: FacultiesService) {}

  @Post()
  @HttpCode(201)
  @Throttle(3, 60)
  async create(@Body() requestBody: CreateFacultyDto): Promise<any> {
    const result = await this.FacultiesService.createFaculty(requestBody);

    return {
      message: 'Faculty has been created successfully',
      result,
    };
  }
}
