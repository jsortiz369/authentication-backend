export class UserCreateCommand {
  constructor(
    readonly names: string,
    readonly surnames: string,
    readonly username: string,
    readonly phone: string,
    readonly email: string,
    readonly password: string,
  ) {}
}
