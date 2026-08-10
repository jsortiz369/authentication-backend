import { User } from 'src/contexts/users/domain/entities/user.entity';
import { UserCommandRepository } from 'src/contexts/users/domain/ports/user-command.repository';
import { UserId } from 'src/contexts/users/domain/vo';
import { PrismaPostgresAdapter } from 'src/shared/database/adapters/prisma-postgres.adapter';

export class UserCommandPostgres implements UserCommandRepository {
  constructor(private readonly _prisma$: PrismaPostgresAdapter) {}

  async create(user: User): Promise<User> {
    await this._prisma$.user.create({
      data: {
        id: user.id._value,
        names: user.names.value,
        surnames: user.surnames.value,
        username: user.username.value,
        phone: user.phone.value,
        email: user.email.value,
        confirmed: user.confirmed,
        status: user.status,
        failedAttempts: user.failedAttempts,
        lockUntil: user.lockUntil,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: null,
      },
    });

    return user;
  }

  async update(data: User): Promise<User> {
    await this._prisma$.user.update({
      data: {
        names: data.names.value,
        surnames: data.surnames.value,
        username: data.username.value,
        phone: data.phone.value,
        email: data.email.value,
        confirmed: data.confirmed,
        status: data.status,
        failedAttempts: data.failedAttempts,
        lockUntil: data.lockUntil,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      where: { id: data.id._value, deletedAt: null },
    });

    return data;
  }

  async updateConfirmed(_id: UserId): Promise<void> {
    await this._prisma$.user.update({
      data: { confirmed: true },
      where: { id: _id._value, deletedAt: null },
    });

    return;
  }

  async updateLoginAttempts(_id: UserId, attempts: number): Promise<void> {
    let lockUntil: null | Date = null;

    if (attempts >= 5) {
      lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + 15);
    }

    await this._prisma$.user.update({
      data: { failedAttempts: attempts, lockUntil },
      where: { id: _id._value, deletedAt: null },
    });
  }

  async delete(userId: UserId): Promise<void> {
    const user = await this._prisma$.user.findUnique({ where: { id: userId._value }, select: { email: true, phone: true } });

    const emailSplit = user!.email.split('@');
    const emailDeleted = `${emailSplit[0]}_deleted@${emailSplit[1]}`;
    const phoneDeleted = `${user!.phone}_deleted`;
    const deleted = new Date();
    await this._prisma$.user.update({
      data: {
        status: false,
        updatedAt: deleted,
        deletedAt: deleted,
        email: emailDeleted,
        phone: phoneDeleted,
      },
      where: { id: userId._value, deletedAt: null },
      omit: { deletedAt: true },
    });
  }
}
