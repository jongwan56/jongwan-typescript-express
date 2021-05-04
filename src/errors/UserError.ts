import { BadRequestError, NotFoundError, UnauthorizedError } from "routing-controllers";

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super("Email or password does not exist.");
    this.name = "UserNotFoundError";
  }
}

export class DuplicateEmailError extends BadRequestError {
  constructor() {
    super("Email already exists.");
    this.name = "DuplicateEmailError";
  }
}

export class AccessTokenExpiredError extends UnauthorizedError {
  constructor() {
    super("Access token has expired.");
    this.name = "TokenExpiredError";
  }
}

export class RefreshTokenExpiredError extends BadRequestError {
  constructor() {
    super("Refresh token has expired.");
    this.name = "TokenExpiredError";
  }
}
