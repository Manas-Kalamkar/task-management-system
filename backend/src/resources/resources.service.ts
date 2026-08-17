import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(taskId: string, dto: CreateResourceDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.resource.create({
      data: {
        name: dto.name,
        url: dto.url,
        taskId,
      },
    });
  }

  async findAll(taskId: string) {
    return this.prisma.resource.findMany({
      where: { taskId },
    });
  }

  async remove(taskId: string, resourceId: string) {
    const resource = await this.prisma.resource.findFirst({
      where: {
        id: resourceId,
        taskId,
      },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    return this.prisma.resource.delete({
      where: { id: resourceId },
    });
  }
}