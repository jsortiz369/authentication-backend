export class AuthLogoutCommand {
  constructor(
    readonly idUser: string,
    readonly idSession: string,
  ) {}
}
