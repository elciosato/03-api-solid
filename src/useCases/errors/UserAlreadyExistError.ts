export class UserAlreadyExistError extends Error {
  constructor() {
    super("Email alread exist");
  }
}
