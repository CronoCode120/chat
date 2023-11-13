export class InvalidParamsError extends Error {
  readonly code: string

  constructor(msg: string) { // eslint-disable-line
    super(msg)
    this.code = 'INVALID_PARAMS'
  }
}
