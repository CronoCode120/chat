import { describe, it, expect } from 'vitest'
import { User } from './User.ts'

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

    expect(user.hasHashPassword(password)).toBe(false)
    expect(user.hasPassword(password)).toBe(true)
  })
})
