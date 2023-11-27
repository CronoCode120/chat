import { ErrorCode } from './errors/ErrorCode.ts'

export const errorStatus = {
  [ErrorCode.INVALID_PARAMS]: 400,
  [ErrorCode.USER_NOT_FOUND]: 404,
  [ErrorCode.SERVER_ERROR]: 500,
  [ErrorCode.UNDEFINED_ENV_VARIABLES]: 500,
  [ErrorCode.USER_ALREADY_EXISTS]: 400
}

export function errorCodeToStatus (code: ErrorCode): number {
  const statusCode = errorStatus[code]
  return statusCode ?? 500
}
