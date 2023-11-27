import { ErrorCode } from './ErrorCode.ts'

export class UserNotFoundError extends Error {
  readonly code: ErrorCode

  constructor(msg: string) { // eslint-disable-line
    super(msg)
    this.code = ErrorCode.USER_NOT_FOUND
  }
}
