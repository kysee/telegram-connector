import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async sendMessage(): Promise<string> {
    const token = 'telegram-api-token';
    const chatId = 'chat-id';
    const message = '<b>🎉 Hello!</b>\n\n<i>This is a formatted message</i>\n\n<code>Code block example</code>\n\n<a href="https://telegram.org">Visit Telegram</a>';

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    try {
      await firstValueFrom(
        this.httpService.post(url, {
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        })
      );

      return 'Message sent successfully';
    } catch (error) {
      return `Failed to send message: ${error}`;
    }
  }
}
