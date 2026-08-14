import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        title: createProjectDto.title,
        description: createProjectDto.description,
        status: createProjectDto.status,
        priority: createProjectDto.priority,
        dueDate: createProjectDto.dueDate
          ? new Date(createProjectDto.dueDate)
          : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: true,
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(
        `Project with ID "${id}" not found`,
      );
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    await this.findOne(id);

    return this.prisma.project.update({
      where: { id },
      data: {
        ...( updateProjectDto.title !== undefined &&{
          title: updateProjectDto.title,
        }),

        ...(updateProjectDto.description !== undefined && {
          description: updateProjectDto.description,
        }),

        ...(updateProjectDto.status !== undefined && {
          status: updateProjectDto.status,
        }),

        ...(updateProjectDto.priority !== undefined && {
          priority: updateProjectDto.priority,
        }),

        ...(updateProjectDto.dueDate !== undefined && {
          dueDate: new Date(updateProjectDto.dueDate),
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.project.delete({
      where: { id },
    });
  }
}