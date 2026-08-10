import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { EnvRepository } from 'src/shared/env/ports/env.repository';
import { DataSendEmail, MailRepository } from '../ports/mail.repository';

export class MailNodemailer implements MailRepository {
  private readonly _transporter$: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly _env$: EnvRepository) {
    this._transporter$ = createTransport(this._configTransportOptions());
  }

  async sendEmail(data: DataSendEmail): Promise<string | null> {
    const titleFrom = data.titleFrom ?? 'Authentication';
    const from = `${titleFrom} <${this._env$.env('SMTP_USERNAME')}>`;

    const info = await this._transporter$.sendMail({
      from,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });

    if (!info || !info.messageId) return null;
    return info.messageId;
  }

  private _configTransportOptions(): SMTPTransport.Options {
    if (this._env$.env('SMTP_TLS')) {
      return {
        host: this._env$.env('SMTP_HOST'),
        port: this._env$.env('SMTP_PORT'),
        secure: true,
        auth: { user: this._env$.env('SMTP_USERNAME'), pass: this._env$.env('SMTP_PASSWORD') },
      };
    }

    return {
      host: this._env$.env('SMTP_HOST'),
      port: this._env$.env('SMTP_PORT'),
      secure: false,
      auth: { user: this._env$.env('SMTP_USERNAME'), pass: this._env$.env('SMTP_PASSWORD') },
      tls: {
        rejectUnauthorized: this._env$.env('NODE_ENV') === 'production',
      },
    };
  }
}
