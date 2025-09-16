import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubService } from './github/github.service';
import { JiraService } from './jira/jira.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, GithubService, JiraService],
})
export class AppModule { }
