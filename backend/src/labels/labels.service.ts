import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';

@Injectable()
export class LabelsService {
  constructor(private readonly prisma: PrismaService) {}
async create(taskId: string, dto: CreateLabelDto) {
  const task = await this.prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  const label = await this.prisma.label.create({
    data: {
      title: dto.title,
    },
  });

  return this.prisma.taskLabel.create({
    data: {
      taskId,
      labelId: label.id,
    },
    include: {
      label: true,
    },
  });
}

async findAll(taskId: string) {
  return this.prisma.taskLabel.findMany({
    where: { taskId },
    include: {
      label: true,
    },
  });
}

  async findOne(id: string) {
    const label = await this.prisma.label.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            task: true,
          },
        },
      },
    });

    if (!label) {
      throw new NotFoundException('Label not found');
    }

    return label;
  }
async remove(taskId: string, labelId: string) {
  return this.prisma.taskLabel.delete({
    where: {
      taskId_labelId: {
        taskId,
        labelId,
      },
    },
  });
}
}