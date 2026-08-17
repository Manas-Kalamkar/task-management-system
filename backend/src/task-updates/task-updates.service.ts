import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskUpdateDto } from './dto/create-task-update.dto';

@Injectable()
export class TaskUpdatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(taskId: string, dto: CreateTaskUpdateDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.taskUpdate.create({
      data: {
        taskId,
        userId: dto.userId,
        type: dto.type,
        message: dto.message,
      },
    });
  }

  async findAll(taskId: string) {
    return this.prisma.taskUpdate.findMany({
      where: { taskId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}