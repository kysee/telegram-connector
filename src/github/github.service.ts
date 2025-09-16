import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubService {
    constructor(private readonly httpService: HttpService) { }

    async sendMessage(body: any, parmas: { token: string, chatId: string, topicId?: string }): Promise<string> {
        console.warn("Github is not supported yet")
        return "Not supported yet";
    }
}
