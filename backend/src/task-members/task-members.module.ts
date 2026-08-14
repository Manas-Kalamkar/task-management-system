import { Module } from '@nestjs/common';
import { TaskMembersController } from './task-members.controller';
import { TaskMembersService } from './task-members.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaskMembersController],
  providers: [TaskMembersService],
})
export class TaskMembersModule {}