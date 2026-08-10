export class AuthSingInCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly ip: string,
    public readonly device: string,
    public readonly browser: string | null,
    public readonly version: string | null,
    public readonly os: string | null,
    public readonly userId: string | null,
    public readonly sessionId: string | null,
  ) {}
}
