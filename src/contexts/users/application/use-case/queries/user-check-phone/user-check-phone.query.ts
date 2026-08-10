export class UserCheckPhoneQuery {
  constructor(
    public readonly phone: string,
    public readonly excludeId?: string,
  ) {}
}
