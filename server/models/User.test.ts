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

  describe('params validation', () => {
    it('throws if username is missing', () => {
      // @ts-expect-error
      expect(() => User.create({ id: notImportantId, password: notImportantPassword })).toThrowError('User must have a name')
    })

    it('throws if id is missing', () => {
      // @ts-expect-error
      expect(() => User.create({ username: notImportantName, password: notImportantPassword })).toThrowError('User must have an id')
    })

    it('throws if password is missing', () => {
      // @ts-expect-error
      expect(() => User.create({ id: notImportantId, username: notImportantName })).toThrowError('User must have a password')
    })

    it.each([
      [{ id: 1234 }, 'id'],
      [{ username: 1234 }, 'name'],
      [{ password: 123456 }, 'password']
      // @ts-expect-error
    ])('throws if param is not a string', ({ id = notImportantId, username = notImportantName, password = notImportantPassword }, param) => {
      expect(() => User.create({ id, username, password })).toThrowError(`User ${param} must be a string`)
    })

    it('throws if password has less than 6 characters', () => {
      expect(() => User.create({ id: notImportantId, username: notImportantName, password: '1234' })).toThrowError('User password must have at least 6 characters')
    })
  })
})
