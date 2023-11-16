import { describe, expect, it } from 'vitest'
import { validateMsg } from './validateMsg.ts'
import { InvalidParamsError } from '../errors/InvalidParams.ts'

describe('validateMsg', () => {
  it('should return a valid message', () => {
    const msg = { content: 'Testing validateMsg', username: '12' }

    const result = validateMsg(msg)

    expect(result).toStrictEqual(msg)
  })

  it('should throw an InvalidParamsError if the message is invalid', () => {
    const msg = { content: 'Testing validateMsg', username: 12 }

    // @ts-expect-error
    expect(() => validateMsg(msg)).toThrowError(InvalidParamsError)
  })

  it('throws if "content" parameter is missing', async () => {
    const msg = { username: 'user' }

    // @ts-expect-error
    expect(() => validateMsg(msg)).toThrowError('Message must have content')
  })

  it('throws if "content" parameter is empty', async () => {
    const msg = { content: '', username: 'user' }

    expect(() => validateMsg(msg)).toThrowError('Message content cannot be empty')
  })

  it('throws if "username" parameter is missing', async () => {
    const msg = { content: 'Testing validateMsg' }

    // @ts-expect-error
    expect(() => validateMsg(msg)).toThrowError('Message must include username')
  })

  it('throws if "content" parameter is not a string', async () => {
    const msg = { content: 123, username: 'user' }

    // @ts-expect-error
    expect(() => validateMsg(msg)).toThrowError('Message content must be a string')
  })

  it('throws if "username" parameter is not a string', async () => {
    const msg = { content: 'Testing validateMsg', username: 12 }

    // @ts-expect-error
    expect(() => validateMsg(msg)).toThrowError('Message username must be a string')
  })
})
