interface IAdders {
  email: string;
  name: string;
}

export interface IMessage {
  to: IAdders;
  from: IAdders;
  subject: string;
  body: string;
}

export default interface IMailProvider {
  sendMail(message: IMessage): Promise<void>;
}
