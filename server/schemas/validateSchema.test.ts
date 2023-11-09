import { describe, expect, it } from 'vitest'
import { validateSchema } from './validateSchema.ts'
import { ZodError, z } from 'zod'

describe('validateSchema', () => {
  const mockSchema = z.object({
    title: z.string(),
    num: z.number()
  })

  it('returns the provided params if they are valid', () => {
    const params = {
      title: 'Testing validateSchema',
      num: -3
    }

    const result = validateSchema({ schema: mockSchema, params })

    expect(result).toEqual(params)
  })

  it('returns a failed result with an error if the validation fails', () => {
    const params = {
      title: 2,
      num: 4
    }

    const result = validateSchema({ schema: mockSchema, params })

    expect(result).toHaveProperty('error')
    // @ts-expect-error
    expect(result.error).toBeInstanceOf(ZodError)
  })
})
