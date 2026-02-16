import {
  Controller,
  Get,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Patch,
  ParseBoolPipe,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationStatus } from '../database/types';
import { UpdateApplicationsDTO } from './DTO/UpdateApplicationsDTO';

@Controller({ path: 'applications', version: '1' })
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  async findAll(
    @Query('status') status?: ApplicationStatus,
    @Query('programId') programId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.applicationsService.findByStatusOrPagination({
      status,
      programId,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':uuid')
  async findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Query('program', ParseBoolPipe) program?: boolean,
  ) {
    return await this.applicationsService.findByUUID(uuid, program);
  }

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // async create(@Body() data: ApplicationsDTO) {
  //   return await this.applicationsService.create(data);
  // }

  @Patch(':uuid/status')
  async updateStatus(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() data: UpdateApplicationsDTO,
  ) {
    return await this.applicationsService.updateStatus(uuid, data.status);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    await this.applicationsService.delete(uuid);
    return { message: 'Application deleted successfully' };
  }
}
