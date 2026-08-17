import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) { }

  @Post()
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateLabelDto,
  ) {
    return this.labelsService.create(taskId, dto);
  }

  @Get()
  findAll(@Param('taskId') taskId: string) {
    return this.labelsService.findAll(taskId);
  }

  @Delete(':labelId')
  remove(
    @Param('taskId') taskId: string,
    @Param('labelId') labelId: string,
  ) {
    return this.labelsService.remove(taskId, labelId);
  }
}