export class AuthRevokeSessionCommand {
  constructor(
    public readonly idUser: string,
    public readonly sessionIdToRevoke: string,
    public readonly currentSessionId: string,
  ) {}
}
