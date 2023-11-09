import { describe, expect, it, vi } from 'vitest'
import { msgInputSchema, validateMsg } from './validateMsg.ts'
import { validateSchema } from './validateSchema.ts'

vi.mock('./validateSchema.ts', () => ({
  validateSchema: vi.fn(() => '::Validation::')
}))

describe('validateMsg', () => {
  it('calls validateSchema properly', () => {
    const msg = {
      content: 'Testing validateMsg',
      userId: '12'
    }

    const result = validateMsg(msg)

    expect(result).toEqual('::Validation::')
    expect(validateSchema).toBeCalledWith({ schema: msgInputSchema, params: msg })
  })
})
