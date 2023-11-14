import { describe, expect, it } from 'vitest'
import { validateUser } from './validateUser.ts'
import { ZodError } from 'zod'

describe('validateUser', () => {
  it('should validate a valid user', () => {
    const user = {
      username: 'user',
      id: '123',
      password: 'password'
    }

    const result = validateUser(user)

    expect(result.success).toBe(true)
    // @ts-expect-error
    expect(result.data).toStrictEqual(user)
  })

  it('should return an error if user is invalid', () => {
    const user = {
      username: 'user',
      id: 123,
      password: 'password'
    }

    // @ts-expect-error
    const result = validateUser(user)

    expect(result.success).toBe(false)
    // @ts-expect-error
    expect(result.error).toBeInstanceOf(ZodError)
  })
})
