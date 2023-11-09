import { describe, expect, it } from 'vitest'
import { validateMsg } from './validateMsg.ts'
import { ZodError } from 'zod'

describe('validateMsg', () => {
  it('should validate a valid message', () => {
    const msg = {
      content: 'Testing validateMsg',
      userId: '12'
    }

    const result = validateMsg(msg)

    expect(result.success).toBe(true)
    // @ts-expect-error
    expect(result.data).toStrictEqual(msg)
  })

  it('should return an error if the message is invalid', () => {
    const msg = {
      content: 'Testing validateMsg',
      userId: 12
    }

    // @ts-expect-error
    const result = validateMsg(msg)

    expect(result.success).toBe(false)
    // @ts-expect-error
    expect(result.error).toBeInstanceOf(ZodError)
  })
})
