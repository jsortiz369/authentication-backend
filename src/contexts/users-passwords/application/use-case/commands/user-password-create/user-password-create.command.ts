export class UserPasswordCreateCommand {
  constructor(
    readonly userId: string,
    readonly password: string,
  ) {}
}
