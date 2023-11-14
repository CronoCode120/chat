import { createHash } from 'node:crypto'

export function hashPassword (plainPassword: string): string {
  return createHash('sha256').update(plainPassword).digest().toString('hex')
}
