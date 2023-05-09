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
  DetailOptionDto,
  ListOptionDto,
  Role,
  Roles,
  RolesGuard,
} from 'src/libraries/common';
import { LecturersService } from 'src/models/lecturers/services/lecturers.service';

@Controller('master-lecturer')
@UseGuards(AuthenticationJWTGuard, RolesGuard)
@Roles(Role.SuperAdmin)
export class MasterLecturerController {
  constructor(private readonly LecturerService: LecturersService) {}

  @Get()
  @HttpCode(200)
  @Throttle(3, 60)
  @Roles(Role.Courses, Role.Faculty, Role.Lecturer, Role.SuperAdmin)
  async findAll(@Query() requestQuery: ListOptionDto): Promise<any> {
    const result = await this.LecturerService.findAllLecturers(requestQuery);

    return {
      message: 'Lecturers has been retrieved successfully',
      result,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @Throttle(3, 60)
  @Roles(Role.Courses, Role.Faculty, Role.Lecturer, Role.SuperAdmin)
  async findOne(@Param() requestParams: DetailOptionDto): Promise<any> {
    const result = await this.LecturerService.findLecturerById(
      requestParams.id,
    );

    return {
      message: 'Lecturer has been retrieve successfully',
      result,
    };
  }
}
