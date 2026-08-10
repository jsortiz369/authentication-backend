export class UserPasswordFindAllByIdUserProjection {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly password: string,
    public readonly isCurrent: boolean,
    public readonly createdAt: Date,
  ) {}
}
