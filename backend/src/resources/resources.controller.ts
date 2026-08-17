import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateResourceDto,
  ) {
    return this.resourcesService.create(taskId, dto);
  }

  @Get()
  findAll(@Param('taskId') taskId: string) {
    return this.resourcesService.findAll(taskId);
  }

  @Delete(':resourceId')
  remove(
    @Param('taskId') taskId: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.resourcesService.remove(taskId, resourceId);
  }
}