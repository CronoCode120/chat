import { ErrorCode } from './ErrorCode.ts'

export class UndefinedEnvVariableError extends Error {
  readonly code: ErrorCode

  constructor() { // eslint-disable-line
    super('An environment variable is undefined')
    this.code = ErrorCode.UNDEFINED_ENV_VARIABLES
  }
}
