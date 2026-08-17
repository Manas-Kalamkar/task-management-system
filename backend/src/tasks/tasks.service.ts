import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/tast-query-dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createTaskDto: CreateTaskDto, reporterId:string) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        ...(createTaskDto.status && {
          status: createTaskDto.status
        })
        ,
        ...(createTaskDto.priority && {
          priority: createTaskDto.priority
        }),
        dueDate: createTaskDto.dueDate
          ? new Date(createTaskDto.dueDate)
          : undefined,

        project: {
          connect: {
            id: createTaskDto.projectId,
          },
        },

        reporter: {
          connect: {
            id: reporterId,
          },
        },

        ...(createTaskDto.parentTaskId && {
          parentTask: {
            connect: {
              id: createTaskDto.parentTaskId,

            }
          }
        }),
      },
    });
  }
  async findAll(query: TaskQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where = {
      ...(query.status && { status: query.status }),
      ...(query.priority && { priority: query.priority }),
      ...(query.projectId && { projectId: query.projectId }),

      ...(query.search && {
        OR: [
          {
            title: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            description: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          project: true,
          reporter: true,
        },
        orderBy: {
          [query.sortBy ?? 'createdAt']: query.order ?? 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        reporter: true,
        comments: true,
        labels: true,
        resources: true,
        subtasks: true
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: {
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        status: updateTaskDto.status,
        priority: updateTaskDto.priority,
        dueDate: updateTaskDto.dueDate
          ? new Date(updateTaskDto.dueDate)
          : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async findSubtasks(id:string){
    await this.findOne(id);

    return this.prisma.task.findMany({
      where:{
        parentTaskId: id
      },
      include:{
        reporter:true,
        project:true
      },
      orderBy:{
        createdAt:'asc',
      }

    })
  }

  async getSubtasks(id: string) {
  await this.findOne(id);

  return this.prisma.task.findMany({
    where: {
      parentTaskId: id,
    },
    include: {
      reporter: true,
      project: true,
    },
  });
}

async createSubtask(parentTaskId: string, dto: CreateTaskDto,reporterId:string) {
  await this.findOne(parentTaskId);

  return this.prisma.task.create({
    data: {
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,

      project: {
        connect: {
          id: dto.projectId,
        },
      },

      reporter: {
        connect: {
          id:reporterId
        },
      },

      parentTask: {
        connect: {
          id: parentTaskId,
        },
      },
    },
  });
}
}