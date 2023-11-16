import { describe, it, expect, vi } from 'vitest'
import { User } from './User.ts'
import { validateUser } from '../schemas/validateUser.ts'
import * as validateUserModule from '../schemas/validateUser.ts'

vi.spyOn(validateUserModule, 'validateUser')

describe('User', () => {
  const notImportantId = 'id'
  const notImportantPassword = 'password'
  const notImportantName = 'username'

  it('has an id', () => {
    const id = 'f969af7f-bc05-46ed-8a82-62a9f49f4927'

    const user = User.create({
      id,
      password: notImportantPassword,
      username: notImportantName
    })

    expect(user.hasId(id)).toBe(true)
  })

  it('has an username', () => {
    const username = 'cronocode'

    const user = User.create({
      id: notImportantId,
      password: notImportantPassword,
      username
    })

    expect(user.hasUsername(username)).toBe(true)
  })

  it('has a hashed password', () => {
    const password = 'qwerty1234'

    const user = User.create({
      id: notImportantId,
      password,
      username: notImportantPassword
    })

    expect(user.getPassword()).not.toEqual(password)
    expect(user.hasPassword(password)).toBe(true)
  })

  it('calls validation function with user params', () => {
    User.create({
      id: notImportantId,
      username: notImportantName,
      password: notImportantPassword
    })

    expect(validateUser).toBeCalledWith({
      id: notImportantId,
      username: notImportantName,
      password: notImportantPassword
    })
  })
})
