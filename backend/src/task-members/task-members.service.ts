import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskMemberDto } from './dto/create-task-member.dto';

@Injectable()
export class TaskMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async add(taskId: string, dto: CreateTaskMemberDto) {
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

    const existing = await this.prisma.taskMember.findUnique({
      where: {
        taskId_userId: {
          taskId,
          userId: dto.userId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('User already assigned to task');
    }

    return this.prisma.taskMember.create({
      data: {
        taskId,
        userId: dto.userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findAll(taskId: string) {
    return this.prisma.taskMember.findMany({
      where: { taskId },
      include: {
        user: true,
      },
    });
  }

  async remove(taskId: string, userId: string) {
    const member = await this.prisma.taskMember.findUnique({
      where: {
        taskId_userId: {
          taskId,
          userId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Task member not found');
    }

    return this.prisma.taskMember.delete({
      where: {
        taskId_userId: {
          taskId,
          userId,
        },
      },
    });
  }
}