export class AuthRefreshTokenCommand {
  constructor(
    readonly idSession: string,
    readonly idUser: string,
  ) {}
}
