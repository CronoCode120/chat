import { ErrorCode } from './ErrorCode.ts'

export class InvalidParamsError extends Error {
  readonly code: ErrorCode

  constructor(msg: string) { // eslint-disable-line
    super(msg)
    this.code = ErrorCode.INVALID_PARAMS
  }
}
