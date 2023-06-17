import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  AuthenticationJWTGuard,
  DetailOptionDto,
  IRequestUser,
  ListOptionDto,
  RequestUser,
  Role,
  Roles,
  RolesGuard,
  validateFileImage,
} from 'src/libraries/common';
import { NewsService as Service } from 'src/models/news/services/news.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateNewsDto } from '../dtos/create-news.dto';
import { UpdateNewsDto } from '../dtos/update-news.dto';

@Controller('master-news')
@UseGuards(AuthenticationJWTGuard, RolesGuard)
@Roles(Role.SuperAdmin)
export class MasterNewsController {
  constructor(private readonly NewsService: Service) {}

  @Get()
  @HttpCode(200)
  @Throttle(60, 60)
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
  @Throttle(60, 60)
  async findOne(@Param() requestParams: DetailOptionDto): Promise<any> {
    const result = await this.NewsService.findNewsById(requestParams.id);

    return {
      message: 'News has been retrieved successfully',
      result,
    };
  }

  @Post()
  @HttpCode(201)
  @UseInterceptors(
    FilesInterceptor('thumbnail', 1, {
      fileFilter: (req, file, cb) => {
        validateFileImage(req, file, cb);
      },
    }),
  )
  @Throttle(60, 60)
  async create(
    @RequestUser() requestUser: IRequestUser,
    @Body() requestBody: CreateNewsDto,
    @UploadedFiles() file: Express.Multer.File,
  ): Promise<any> {
    const result = await this.NewsService.createNews(
      file,
      requestBody,
      requestUser,
    );

    return {
      message: 'News has been created successfully',
      result,
    };
  }

  @Put(':id')
  @HttpCode(200)
  @UseInterceptors(
    FilesInterceptor('thumbnail', 1, {
      fileFilter: (req, file, cb) => {
        validateFileImage(req, file, cb);
      },
    }),
  )
  @Throttle(60, 60)
  async update(
    @RequestUser() requestUser: IRequestUser,
    @Param() requestParams: DetailOptionDto,
    @Body() requestBody: UpdateNewsDto,
    @UploadedFiles() file: Express.Multer.File,
  ): Promise<any> {
    const result = await this.NewsService.updateNews(
      requestParams.id,
      file,
      requestBody,
      requestUser,
    );

    return {
      message: 'News has been updated successfully',
      result,
    };
  }
}
