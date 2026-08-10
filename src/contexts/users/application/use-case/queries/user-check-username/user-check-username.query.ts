export class UserCheckUsernameQuery {
  constructor(
    public readonly username: string,
    public readonly excludeId?: string,
  ) {}
}
