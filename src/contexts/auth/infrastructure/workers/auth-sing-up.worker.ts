import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import path from 'node:path';
import fs from 'node:fs';

import { QUEUE } from 'src/app/constants/queue.constant';
import { MailRepository } from 'src/shared/integrations/ports/mail.repository';

interface Data {
  email: string;
  names: string;
  code: string;
}

@Processor(QUEUE.emails.confirm_account, { concurrency: 2 })
export class AuthSingUpWorker extends WorkerHost {
  constructor(private readonly _mailRepositry$: MailRepository) {
    super();
  }

  async process(job: Job<Data>): Promise<any> {
    const pathTemplate = path.join(process.cwd(), 'uploads/templates', 'confirm-account.html');
    if (!fs.existsSync(pathTemplate)) throw new Error('Template not found');
    let template = fs.readFileSync(pathTemplate, 'utf-8');

    template = template.replace('{{CODE}}', job.data.code);
    template = template.replace('{{NAMES}}', job.data.names);

    await this._mailRepositry$.sendEmail({
      to: job.data.email,
      subject: '👋 Bienvenido — confirma tu cuenta',
      html: template,
    });
  }
}
