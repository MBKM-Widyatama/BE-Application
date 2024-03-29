import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  AuthenticationJWTGuard,
  RolesGuard,
  Roles,
  Role,
  ListOptionDto,
  DetailOptionDto,
} from 'src/libraries/common';
import { CoursesService as Service } from 'src/models/courses/services/courses.service';
import { CreateCourseDto, UpdateCourseDto } from '../dtos';

@Controller('master-courses')
@UseGuards(AuthenticationJWTGuard, RolesGuard)
@Roles(Role.SuperAdmin)
export class MasterCoursesController {
  constructor(private readonly CoursesService: Service) {}

  @Get()
  @HttpCode(200)
  @Throttle(60, 60)
  @Roles(Role.Courses, Role.Faculty, Role.SuperAdmin)
  public async findAll(@Query() requestQuery: ListOptionDto): Promise<any> {
    const result = await this.CoursesService.findAllCourses(requestQuery);

    return {
      message: 'Courses has been retrieved successfully',
      result,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @Throttle(60, 60)
  @Roles(Role.Courses, Role.Faculty, Role.Lecturer, Role.SuperAdmin)
  public async findOne(@Param() requestParams: DetailOptionDto): Promise<any> {
    const result = await this.CoursesService.findCourseById(requestParams.id);

    return {
      message: 'Course has been retrieved successfully',
      result,
    };
  }

  @Post()
  @HttpCode(201)
  @Throttle(60, 60)
  @Roles(Role.SuperAdmin)
  public async create(@Body() requestBody: CreateCourseDto): Promise<any> {
    const result = await this.CoursesService.createCourses(requestBody);

    return {
      message: 'Course has been created successfully',
      result,
    };
  }

  @Put(':id')
  @HttpCode(200)
  @Throttle(60, 60)
  @Roles(Role.SuperAdmin)
  public async update(
    @Param() requestParams: DetailOptionDto,
    @Body() requestBody: UpdateCourseDto,
  ): Promise<any> {
    const result = await this.CoursesService.updateCourses(
      requestParams.id,
      requestBody,
    );

    return {
      message: 'Course has been updated successfully',
      result,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @Throttle(60, 60)
  @Roles(Role.SuperAdmin)
  public async delete(@Param() requestParams: DetailOptionDto): Promise<any> {
    const result = await this.CoursesService.deleteCourses(requestParams.id);

    return {
      message: 'Course has been deleted successfully',
      result,
    };
  }

  @Patch(':id/restore')
  @HttpCode(200)
  @Throttle(60, 60)
  @Roles(Role.SuperAdmin)
  public async restore(@Param() requestParams: DetailOptionDto): Promise<any> {
    const result = await this.CoursesService.restoreCourses(requestParams.id);

    return {
      message: 'Course has been restored successfully',
      result,
    };
  }
}
