import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import path from 'node:path';
import fs from 'node:fs';

import { QUEUE } from 'src/app/constants/queue.constant';
import { MailRepository } from 'src/shared/integrations/ports/mail.repository';
import { EnvRepository } from 'src/shared/env/ports/env.repository';

interface Data {
  email: string;
  names: string;
  token: string;
}

@Processor(QUEUE.emails.recover_password, { concurrency: 2 })
export class AuthRecoverPasswordWorker extends WorkerHost {
  constructor(
    private readonly _envRepository$: EnvRepository,
    private readonly _mailRepositry$: MailRepository,
  ) {
    super();
  }

  async process(job: Job<Data>): Promise<any> {
    const pathTemplate = path.join(process.cwd(), 'uploads/templates', 'reset-password.html');
    if (!fs.existsSync(pathTemplate)) throw new Error('Template not found');
    let template = fs.readFileSync(pathTemplate, 'utf-8');

    // TODO: validate link
    const link = this._envRepository$.env('APP_URL') + '/auth/reset-password?token=' + job.data.token;

    template = template.replace('{{NAMES}}', job.data.names);
    template = template.replaceAll('{{URL}}', link);

    await this._mailRepositry$.sendEmail({
      to: job.data.email,
      subject: '🔐 Restablece tu contraseña',
      html: template,
    });
  }
}
