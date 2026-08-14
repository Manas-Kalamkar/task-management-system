import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async addMember(taskId: string, userId: string) {
    // Make sure task exists
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Make sure user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent duplicate assignment
    const existing = await this.prisma.taskMember.findUnique({
      where: {
        taskId_userId: {
          taskId,
          userId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('User is already assigned to this task');
    }

    return this.prisma.taskMember.create({
      data: {
        taskId,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findMembers(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.taskMember.findMany({
      where: { taskId },
      include: {
        user: true,
      },
    });
  }

  async removeMember(taskId: string, userId: string) {
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