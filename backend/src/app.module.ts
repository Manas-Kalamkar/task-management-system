import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { TaskMembersModule } from './task-members/task-members.module';
import { LabelsModule } from './labels/labels.module';
import { ResourcesModule } from './resources/resources.module';
import { TaskUpdatesModule } from './task-updates/task-updates.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    ProjectsModule,
    UsersModule,
    TasksModule,
    CommentsModule,
    TaskMembersModule,
    LabelsModule,
    ResourcesModule,
    TaskUpdatesModule,
    AuthModule,
  ],
})
export class AppModule {}