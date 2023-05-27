import {
  Controller,
  Get,
  HttpCode,
  Param,
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
import { CoursesService } from 'src/models/courses/services/courses.service';

@Controller('master-courses')
@UseGuards(AuthenticationJWTGuard, RolesGuard)
@Roles(Role.SuperAdmin)
export class MasterCoursesController {
  constructor(private readonly CoursesService: CoursesService) {}

  @Get()
  @HttpCode(200)
  @Throttle(5, 10)
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
  @Throttle(5, 10)
  @Roles(Role.Courses, Role.Faculty, Role.Lecturer, Role.SuperAdmin)
  public async findOne(@Param() requestParams: DetailOptionDto): Promise<any> {
    const result = await this.CoursesService.findCourseById(requestParams.id);

    return {
      message: 'Course has been retrieved successfully',
      result,
    };
  }
}
