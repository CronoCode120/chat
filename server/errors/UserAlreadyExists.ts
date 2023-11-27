import { ErrorCode } from './ErrorCode.ts'

export class UserAlreadyExistsError extends Error {
  readonly code: ErrorCode

  constructor() { // eslint-disable-line
    super('User already exists')
    this.code = ErrorCode.USER_ALREADY_EXISTS
  }
}
