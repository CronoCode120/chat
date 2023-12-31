import { UserType, validateUser } from '../schemas/validateUser.ts'
import { comparePassword, hashPassword } from '../utils/hashPassword.ts'

export class User {
  readonly id
  readonly username
  readonly #password

  static create ({ id, username, password }: UserType): User {
    return new User({ id, username, password })
  }

  constructor(userParams: UserType) { // eslint-disable-line
    const { id, username, password } = validateUser(userParams)

    this.id = id
    this.username = username
    this.#password = hashPassword(password)
  }

  hasId = (id: string): boolean => this.id === id

  hasUsername = (username: string): boolean => this.username === username

  hasPassword = (plainPassword: string): boolean => comparePassword(plainPassword, this.#password)

  getPassword = (): string => this.#password
}
