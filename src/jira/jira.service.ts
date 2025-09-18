import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JiraService {
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
        console.debug('jira webhook event', evt);
        const [what, action] = extractAction(evt.webhookEvent);
        const who = evt.user?.displayName ?? evt.comment.author.displayName ?? `unknown(${what})`;
        return `Jira\n\n<b>${who} ${action} the ${what}</b>
<b><a href="https://beatoz.atlassian.net/browse/${evt.issue.key}">${evt.issue.key} ${evt.issue.fields.summary}</a></b>
    
Status: <code>${evt.issue.fields.status.name}</code>
Type: <code>${evt.issue.fields.issuetype.name}</code> 
Assignee: <code>${evt.issue.fields.assignee?.displayName ?? 'None'}</code>
Action: ${evt.webhookEvent}
`;
    }
}

function escapeMarkdownV2(text) {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

function extractAction(input: string): string[] {
    const ret = input.split("_");
    const what = ret[ret.length - 2];
    const action = ret[ret.length - 1];
    return [what, action];
}
