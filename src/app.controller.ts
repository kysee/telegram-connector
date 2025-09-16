import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { JiraService } from './jira/jira.service';
import { GithubService } from './github/github.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jiraService: JiraService,
    private readonly githubService: GithubService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('jira/sendMessage/:token/:chatId')
  async jiraSendMessage(
    @Param('token') token: string,
    @Param('chatId') chatId: string,
    @Body() body: any
  ): Promise<string> {

    const [_chatId, _topicId] = chatId.split("@");
    return await this.jiraService.sendMessage(body, {
      token: token,
      chatId: _chatId,
      topicId: _topicId,
    });
  }

  @Post('github/sendMessage/:token/:chatId')
  async githubSendMessage(
    @Param('token') token: string,
    @Param('chatId') chatId: string,
    @Body() body: any
  ): Promise<string> {

    const [_chatId, _topicId] = chatId.split("@");
    return await this.githubService.sendMessage(body, {
      token: token,
      chatId: _chatId,
      topicId: _topicId,
    });
  }
}
