import bcrypt from 'bcrypt';

import { PasswordRepository } from '../ports/password.repository';

export class BcryptPasswordAdapter implements PasswordRepository {
  private readonly saltRounds = bcrypt.genSaltSync(12);

  hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
