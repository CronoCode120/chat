import { describe, expect, it } from 'vitest'
import { validateUser } from './validateUser.ts'
import { InvalidParamsError } from '../errors/InvalidParams.ts'

describe('validateUser', () => {
  const mockUser = {
    username: 'user',
    id: '123',
    password: 'password'
  }

  it('should return a valid user', () => {
    const result = validateUser(mockUser)

    expect(result).toStrictEqual(mockUser)
  })

  it('should throw an InvalidParamsError if user is invalid', () => {
    const user = {
      username: 'user',
      id: 123,
      password: 'password'
    }

    // @ts-expect-error
    expect(() => validateUser(user)).toThrowError(InvalidParamsError)
  })

  it('throws if username is missing', () => {
    // @ts-expect-error
    expect(() => validateUser({ id: mockUser.id, password: mockUser.password })).toThrowError('User must have a name')
  })

  it('throws if id is missing', () => {
    // @ts-expect-error
    expect(() => validateUser({ username: mockUser.username, password: mockUser.password })).toThrowError('User must have an id')
  })

  it('throws if password is missing', () => {
    // @ts-expect-error
    expect(() => validateUser({ id: mockUser.id, username: mockUser.username })).toThrowError('User must have a password')
  })

  it.each([
    [{ id: 1234 }, 'id'],
    [{ username: 1234 }, 'name'],
    [{ password: 123456 }, 'password']
    // @ts-expect-error
  ])('throws if param is not a string', ({ id = mockUser.id, username = mockUser.username, password = mockUser.password }, param) => {
    expect(() => validateUser({ id, username, password })).toThrowError(`User ${param} must be a string`)
  })

  it('throws if password has less than 6 characters', () => {
    expect(() => validateUser({ id: mockUser.id, username: mockUser.username, password: '1234' })).toThrowError('User password must have at least 6 characters')
  })

  it('throws if username has less than 4 characters', () => {
    expect(() => validateUser({ id: mockUser.id, username: 'you', password: mockUser.password })).toThrowError('User name must have at least 4 characters')
  })
})
