export class ServerError extends Error {
  readonly code: string

  constructor(msg: string) { // eslint-disable-line
    super(msg)
    this.code = 'UNEXPECTED_SERVER_ERROR'
  }
}
