import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Get,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { FacultiesService } from 'src/models/faculties/services/faculties.service';
import { Throttle } from '@nestjs/throttler';
import {
  AuthenticationJWTGuard,
  RolesGuard,
  Role,
  ListOptionDto,
} from 'src/libraries/common';
import { Roles } from 'src/libraries/common/decorators';
import { CreateFacultyDto } from '../dtos';
import { UpdateFacultyDto } from '../dtos/update-faculty.dto';
import { DetailOptionDto } from 'src/libraries/common/dto/detail-option.dto';

@Controller('master-faculties')
@UseGuards(AuthenticationJWTGuard, RolesGuard)
@Roles(Role.SuperAdmin)
export class MasterFacultiesController {
  constructor(private readonly FacultiesService: FacultiesService) {}

  @Post()
  @HttpCode(201)
  @Throttle(3, 60)
  @Roles(Role.SuperAdmin)
  async create(@Body() requestBody: CreateFacultyDto): Promise<any> {
    const result = await this.FacultiesService.createFaculty(requestBody);

    return {
      message: 'Faculty has been created successfully',
      result,
    };
  }

  @Get()
  @HttpCode(200)
  @Throttle(3, 60)
  @Roles(Role.SuperAdmin, Role.Courses, Role.Faculty, Role.Lecturer)
  async findAll(@Query() requestQuery: ListOptionDto): Promise<any> {
    const result = await this.FacultiesService.findAllFaculties(requestQuery);

    return {
      message: 'Faculties has been retrieved successfully',
      result,
    };
  }

  @Put(':id')
  @HttpCode(200)
  @Throttle(3, 60)
  @Roles(Role.SuperAdmin)
  async update(
    @Param() requestParams: DetailOptionDto,
    @Body() requestBody: UpdateFacultyDto,
  ): Promise<any> {
    const result = await this.FacultiesService.updateFaculty(
      requestParams.id,
      requestBody,
    );

    return {
      message: 'Faculty has been updated successfully',
      result,
    };
  }
}