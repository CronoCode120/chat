import { createHash } from 'node:crypto'

function hashPassword (plainPassword: string): string {
  return createHash('sha256').update(plainPassword).digest().toString('hex')
}

interface UserType { id: string, username: string, password: string }

export class User {
  readonly #id
  readonly #username
  readonly #password

  static create ({ id, username, password }: UserType): User {
    return new User({ id, username, password })
  }

  constructor({ id, username, password }: UserType) { // eslint-disable-line
    this.#id = id
    this.#username = username
    this.#password = hashPassword(password)
  }

  hasId = (id: string): boolean => this.#id === id

  hasUsername = (username: string): boolean => this.#username === username

  hasHashPassword = (hash: string): boolean => this.#password === hash

  hasPassword (plainPassword: string): boolean {
    return this.#password === hashPassword(plainPassword)
  }
}
