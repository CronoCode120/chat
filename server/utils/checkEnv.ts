import { UndefinedEnvVariableError } from '../errors/UndefinedEnvVariable.ts'

export function checkEnv (env: Array<string | undefined>): void {
  env.forEach(envVar => checkEnvVar(envVar))
}

export function checkEnvVar (envVar: string | undefined): void {
  if (typeof envVar === 'undefined') throw new UndefinedEnvVariableError()
}
