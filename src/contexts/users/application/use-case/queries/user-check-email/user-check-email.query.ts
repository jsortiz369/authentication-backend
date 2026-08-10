export class UserCheckEmailQuery {
  constructor(
    public readonly email: string,
    public readonly excludeId?: string,
  ) {}
}
