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
import { CategorialNewsService as Service } from 'src/models/categorial-news/services/categorial-news.service';

@Controller('master-categorial-news')
@UseGuards(AuthenticationJWTGuard, RolesGuard)
@Roles(Role.SuperAdmin, Role.Courses, Role.Faculty)
export class MasterCategorialNewsController {
  constructor(private readonly CategorialNewsService: Service) {}

  @Get()
  @HttpCode(200)
  @Throttle(5, 10)
  @Roles(Role.SuperAdmin, Role.Courses, Role.Faculty)
  public async findAll(@Query() requestQuery: ListOptionDto): Promise<any> {
    const result = await this.CategorialNewsService.findAllCategorialNews(
      requestQuery,
    );

    return {
      message: 'Categorial News has been retrieved successfully',
      result,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @Throttle(5, 10)
  @Roles(Role.SuperAdmin, Role.Courses, Role.Faculty)
  public async findOne(@Param() requestParams: DetailOptionDto): Promise<any> {
    const result = await this.CategorialNewsService.findCategorialNewsById(
      requestParams.id,
    );

    return {
      message: 'Categorial News has been retrieved successfully',
      result,
    };
  }
}
