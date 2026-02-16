import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ProgramDTO } from './DTO/ProgramDTO';

@Controller({ path: 'programs', version: '1' })
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  async findAll() {
    return await this.programsService.findAll();
  }

  @Get('active')
  async findActive() {
    return await this.programsService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.programsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: ProgramDTO) {
    return await this.programsService.create(data);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: ProgramDTO) {
    return await this.programsService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.programsService.delete(id);
    return { message: 'Program deleted successfully' };
  }
}
