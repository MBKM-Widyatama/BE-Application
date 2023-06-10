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
import { NewsService as Service } from 'src/models/news/services/news.service';

@Controller('master-news')
@UseGuards(AuthenticationJWTGuard, RolesGuard)
@Roles(Role.SuperAdmin)
export class MasterNewsController {
  constructor(private readonly NewsService: Service) {}

  @Get()
  @HttpCode(200)
  @Throttle(3, 60)
  @Roles(Role.SuperAdmin, Role.Courses, Role.Faculty, Role.Lecturer)
  async findAll(@Query() requestQuery: ListOptionDto): Promise<any> {
    const result = await this.NewsService.findAllNews(requestQuery);

    return {
      message: 'News has been retrieved successfully',
      result,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @Throttle(3, 60)
  async findOne(@Param() requestParams: DetailOptionDto): Promise<any> {
    const result = await this.NewsService.findNewsById(requestParams.id);

    return {
      message: 'News has been retrieved successfully',
      result,
    };
  }
}
