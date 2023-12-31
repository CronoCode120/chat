import { ErrorCode } from './ErrorCode.ts'

export class ServerError extends Error {
  readonly code: ErrorCode

  constructor(msg: string) { // eslint-disable-line
    super(msg)
    this.code = ErrorCode.SERVER_ERROR
  }
}
