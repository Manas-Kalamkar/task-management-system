import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(taskId: string, createCommentDto: CreateCommentDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,

        task: {
          connect: { id: taskId },
        },

        user: {
          connect: { id: createCommentDto.userId },
        },
      },
      include: {
        user: true,
      },
    });
  }

  async findByTask(taskId: string) {
    return this.prisma.comment.findMany({
      where: {
        taskId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.prisma.comment.update({
      where: { id },
      data: {
        content: updateCommentDto.content,
      },
    });
  }

  async remove(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}