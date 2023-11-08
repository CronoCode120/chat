import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest'
import { MessageModel } from './message.ts'

describe('MessageModelSql', () => {
  let messageModel: MessageModel

  beforeAll(async () => {
    messageModel = new MessageModel()
  })

  afterEach(async () => await messageModel.reset())

  afterAll(async () => messageModel.disconnect())

  it('gets all messages from a provided offset', async () => {
    const newMessages = [
      {
        content: 'Message 1',
        userId: '1'
      },
      {
        content: 'Message 2',
        userId: '2'
      },
      {
        content: 'Message 3',
        userId: '3'
      },
      {
        content: 'Message 4',
        userId: '4'
      }
    ]

    for (const msg of newMessages) {
      await messageModel.save(msg)
    }

    const message = await messageModel.getAllFromOffset({ serverOffset: 2 })

    const expectedMsg = [
      {
        content: 'Message 3',
        id: 3,
        user_id: '3'
      },
      {
        content: 'Message 4',
        id: 4,
        user_id: '4'
      }
    ]
    expect(message).toEqual(expectedMsg)
  })
})
