import IMailProvider, { type IMessage } from '../interfaces/mail-provider.interfaces';
import { createTransport } from 'nodemailer';

export default class MailTrapMailProvider implements IMailProvider {
  private transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendMail(message: IMessage): Promise<void> {
    try {
      await this.transporter.sendMail({
        to: {
          name: message.to.name,
          address: message.to.email,
        },
        from: {
          name: message.from.name,
          address: message.from.email,
        },
        subject: message.subject,
        html: message.body,
      });
    } catch (error) {
      throw error;
    }
  }
}
