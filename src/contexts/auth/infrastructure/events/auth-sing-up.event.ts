import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { QUEUE } from 'src/app/constants/queue.constant';

interface Data {
  email: string;
  names: string;
  code: string;
}

export class AuthSingUpEvent {
  constructor(@InjectQueue(QUEUE.emails.confirm_account) private readonly _queue$: Queue) {}

  async execute(data: Data) {
    return await this._queue$.add(QUEUE.emails.confirm_account, data);
  }
}
