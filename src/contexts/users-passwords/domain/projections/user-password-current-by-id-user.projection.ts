export class UserPasswordCurrentProjection {
  constructor(
    readonly password: string,
    readonly createdAt: Date,
  ) {}
}
