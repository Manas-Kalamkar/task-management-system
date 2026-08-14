import { Controller, Delete, Get, Param, Post, Body } from '@nestjs/common';
import { TaskMembersService } from './task-members.service';

@Controller('tasks/:taskId/members')
export class TaskMembersController {
  constructor(private readonly taskMembersService: TaskMembersService) {}

  @Post()
  addMember(
    @Param('taskId') taskId: string,
    @Body('userId') userId: string,
  ) {
    return this.taskMembersService.addMember(taskId, userId);
  }

  @Get()
  findMembers(@Param('taskId') taskId: string) {
    return this.taskMembersService.findMembers(taskId);
  }

  @Delete(':userId')
  removeMember(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ) {
    return this.taskMembersService.removeMember(taskId, userId);
  }
}