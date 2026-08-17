import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TaskUpdatesService } from './task-updates.service';
import { CreateTaskUpdateDto } from './dto/create-task-update.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/updates')
export class TaskUpdatesController {
  constructor(private readonly taskUpdatesService: TaskUpdatesService) {}

  @Post()
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateTaskUpdateDto,
  ) {
    return this.taskUpdatesService.create(taskId, dto);
  }

  @Get()
  findAll(@Param('taskId') taskId: string) {
    return this.taskUpdatesService.findAll(taskId);
  }
}