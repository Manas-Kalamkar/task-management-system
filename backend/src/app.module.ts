import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { TaskMembersModule } from './task-members/task-members.module';

@Module({
  imports: [PrismaModule, ProjectsModule, TasksModule, UsersModule, CommentsModule, TaskMembersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}