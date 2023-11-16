export class NotFoundError extends Error {
  readonly code

  constructor(msg: string) { // eslint-disable-line
    super(msg)
    this.code = 'NOT_FOUND'
  }
}
