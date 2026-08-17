import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { TaskMembersController } from './task-members.controller';
import { TaskMembersService } from './task-members.service';

@Module({
  imports: [PrismaModule],
  controllers: [TaskMembersController],
  providers: [TaskMembersService],
})
export class TaskMembersModule {}