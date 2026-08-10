export type DataSendEmail = {
  titleFrom?: string;
  to: string | string[];
  subject: string;
  text?: string;
  html: string;
};

export abstract class MailRepository {
  abstract sendEmail(data: DataSendEmail): Promise<string | null>;
}
