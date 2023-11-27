import { Request, Response } from 'express'
import { errorCodeToStatus } from './errorCodeToStatus.ts'
import { CustomError } from './errors/ErrorCode.ts'

export const handleError = (err: CustomError, req: Request, res: Response): void => {
  const statusCode = errorCodeToStatus(err.code)
  res.status(statusCode).json({ code: err.code, error: err.message })
}
