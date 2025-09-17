import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JiraService {
    constructor(private readonly httpService: HttpService) { }

    async sendMessage(body: any, parmas: { token: string, chatId: string, topicId?: string }): Promise<string> {
        const url = `https://api.telegram.org/bot${parmas.token}/sendMessage`;
        const message = `Jira\n\n${this.makeHtml(body)}`;

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
        const action = extractAction(evt.webhookEvent);
        return `<b>${evt.user?.displayName ?? 'Unknown'} ${action} the ${evt.issue.fields.issuetype.name}</b>
<b><a href="https://beatoz.atlassian.net/browse/${evt.issue.key}">${evt.issue.key} ${evt.issue.fields.summary}</a></b>
    
Status: <code>${evt.issue.fields.status.name}</code>
Type: <code>${evt.issue.fields.issuetype.name}</code> 
Assignee: <code>${evt.issue.fields.assignee?.displayName ?? 'None'}</code>
`;
    }
}

function escapeMarkdownV2(text) {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

function extractAction(input: string): string {
    const ret = input.split("_");
    return ret == null ? "unknown" : ret[ret.length - 1];
}
