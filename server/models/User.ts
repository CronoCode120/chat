import { UserType, validateUser } from '../schemas/validateUser.ts'
import { hashPassword } from '../utils/hashPassword.ts'

export class User {
  readonly #id
  readonly #username
  readonly #password

  static create ({ id, username, password }: UserType): User {
    return new User({ id, username, password })
  }

  constructor(userParams: UserType) { // eslint-disable-line
    const params = validateUser(userParams)
    if (!params.success) throw params.error
    const { id, username, password } = params.data
    this.#id = id
    this.#username = username
    this.#password = hashPassword(password)
  }

  hasId = (id: string): boolean => this.#id === id

  hasUsername = (username: string): boolean => this.#username === username

  hasHashPassword = (hash: string): boolean => this.#password === hash

  hasPassword = (plainPassword: string): boolean => this.#password === hashPassword(plainPassword)
}
