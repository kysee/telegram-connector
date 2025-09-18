import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GithubService {
    constructor(private readonly httpService: HttpService) { }

    async sendMessage(body: any, parmas: { token: string, chatId: string, topicId?: string }): Promise<string> {
        const url = `https://api.telegram.org/bot${parmas.token}/sendMessage`;
        const message = this.makeHtml(body);
        try {
            await firstValueFrom(
                this.httpService.post(url, {
                    chat_id: parmas.chatId,
                    message_thread_id: parmas.topicId ?? '',
                    text: message,
                    parse_mode: "HTML"
                })
            );

            return 'Message sent successfully';
        } catch (error) {
            console.error(error);
            return `Failed to send message: ${error}`;
        }
    }

    makeHtml(evt: any) {
        const repoUrl = evt.repository.html_url;
        const repoName = evt.repository.name;
        const pusherName = evt.pusher.name;
        const commits = evt.commits

        let htmlMsg = `Github

<b>${commits.length} new commit pushed to <a href="${repoUrl}">${repoName}</a> by ${pusherName}</b>
<blockquote expandable>
`;
        for (const c of commits) {
            htmlMsg += `<a href='${c.url}'><code>${c.id.substring(0, 7)}</code></a> ${c.message}\n`;
        }
        htmlMsg += '</blockquote>';
        return htmlMsg;
    }
}
