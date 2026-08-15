export class AuthSessionsQuery {
  constructor(
    public readonly idUser: string,
    public readonly currentSessionId: string,
  ) {}
}
