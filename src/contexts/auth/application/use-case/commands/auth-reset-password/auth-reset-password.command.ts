export class AuthResetPasswordCommand {
  constructor(
    public readonly token: string,
    public readonly password: string,
  ) {}
}
