import { Module } from '@nestjs/common';
import { TaskUpdatesController } from './task-updates.controller';
import { TaskUpdatesService } from './task-updates.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaskUpdatesController],
  providers: [TaskUpdatesService],
})
export class TaskUpdatesModule {}