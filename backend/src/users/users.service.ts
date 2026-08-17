import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
  try {
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        fullName: createUserDto.fullName,
        password: createUserDto.password,
        title: createUserDto.title ?? '',
        avatarUrl: createUserDto.avatarUrl ?? '',
      },
    });
  } catch (e) {
    throw new BadRequestException(
      'Users must be created through /auth/register',
    );
  }
}
  async findAll() {
    return this.prisma.user.findMany({
      omit: {
        password: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        username: updateUserDto.username,
        fullName: updateUserDto.fullName,
        title: updateUserDto.title,
        avatarUrl: updateUserDto.avatarUrl,
      },
      omit: {
        password: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
      omit: {
        password: true,
      },
    });
  }
}