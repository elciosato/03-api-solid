export class LateCheckInValidationError extends Error {
  constructor() {
    super(
      "The check-in can only be validated before 20 minutes expiration time"
    );
  }
}
