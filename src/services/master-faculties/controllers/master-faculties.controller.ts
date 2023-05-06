import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { CreateFacultyDto } from '../dtos/create-faculty.dto';
import { FacultiesService } from 'src/models/faculties/services/faculties.service';
import { Throttle } from '@nestjs/throttler';

@Controller('master-faculties')
export class MasterFacultiesController {
  constructor(private readonly FacultiesService: FacultiesService) {}

  @Post()
  @HttpCode(201)
  @Throttle(3, 60)
  async create(@Body() requestBody: CreateFacultyDto) {
    const result = await this.FacultiesService.createFaculty(requestBody);

    return {
      message: 'Faculty has been created successfully',
      result,
    };
  }
}
