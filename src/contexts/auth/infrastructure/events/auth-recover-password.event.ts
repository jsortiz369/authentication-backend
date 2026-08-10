import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { QUEUE } from 'src/app/constants/queue.constant';

interface Data {
  email: string;
  names: string;
  token: string;
}

export class AuthRecoverPasswordEvent {
  constructor(@InjectQueue(QUEUE.emails.recover_password) private readonly _queue$: Queue) {}

  async execute(data: Data) {
    return await this._queue$.add(QUEUE.emails.recover_password, data);
  }
}
