import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskMemberDto } from './dto/create-task-member.dto';
import { TaskMembersService } from './task-members.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/members')
export class TaskMembersController {
  constructor(private readonly taskMembersService: TaskMembersService) {}

  @Post()
  add(
    @Param('taskId') taskId: string,
    @Body() dto: CreateTaskMemberDto,
  ) {
    return this.taskMembersService.add(taskId, dto);
  }

  @Get()
  findAll(@Param('taskId') taskId: string) {
    return this.taskMembersService.findAll(taskId);
  }

  @Delete(':userId')
  remove(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ) {
    return this.taskMembersService.remove(taskId, userId);
  }
}