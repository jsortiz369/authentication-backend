export class AuthSingUpConfirmCommand {
  constructor(
    public readonly otp: string,
    public readonly idUser: string,
    public readonly ip: string,
    public readonly device: string,
    public readonly browser: string | null,
    public readonly version: string | null,
    public readonly os: string | null,
    public readonly userId: string | null,
    public readonly sessionId: string | null,
  ) {}
}
