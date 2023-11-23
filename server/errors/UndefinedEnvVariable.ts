export class UndefinedEnvVariableError extends Error {
  code: string

  constructor() { // eslint-disable-line
    super('An environment variable is undefined')
    this.code = 'UNDEFINED_ENV_VAR'
  }
}
