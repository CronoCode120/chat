import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { MessageModel } from './message.ts'
import { MessageInput } from '../../schemas/validateMsg.ts'

describe('MessageModelSql', () => {
  let messageModel: MessageModel, saveAllMsgs: (msgArr: MessageInput[]) => Promise<void>

  beforeAll(async () => {
    messageModel = new MessageModel()

    saveAllMsgs = async (msgArr: MessageInput[]): Promise<void> => {
      for (const msg of msgArr) {
        await messageModel.save(msg)
      }
    }
  })

  afterEach(async () => await messageModel.reset())

  afterAll(async () => messageModel.disconnect())

  describe('getAllFromOffset', () => {
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
    it('gets all messages from a provided offset', async () => {
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

      await saveAllMsgs(newMessages)

      const messageArr = await messageModel.getAllFromOffset({ serverOffset: 2 })

      expect(messageArr).toEqual(expectedMsg)
    })

    it('gets all messages if serverOffset is not provided', async () => {
      const expectedMsg = newMessages.map((msg, idx) => ({ content: msg.content, id: idx + 1, user_id: msg.userId }))

      await saveAllMsgs(newMessages)

      const messageArr = await messageModel.getAllFromOffset()

      expect(messageArr).toEqual(expectedMsg)
    })
  })

  describe('save', () => {
    it('saves a message properly', async () => {
      const newMsg = {
        content: 'Mensaje de prueba',
        userId: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000'
      }

      await messageModel.save(newMsg)
      const result = await messageModel.getAllFromOffset()

      const expectedMsg = {
        content: 'Mensaje de prueba',
        user_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
        id: 1
      }
      // @ts-expect-error
      expect(result[0]).toEqual(expectedMsg)
    })

    it('throws if "content" parameter is missing', async () => {
      const newMsg = {
        userId: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000'
      }

      // @ts-expect-error
      await expect(async () => await messageModel.save(newMsg)).rejects.toThrowError('Message must have content')
    })

    it('throws if "userId" parameter is missing', async () => {
      const newMsg = {
        content: 'Test'
      }

      // @ts-expect-error
      await expect(async () => await messageModel.save(newMsg)).rejects.toThrowError('Message must include userId')
    })

    it('throws if "content" parameter is not a string', async () => {
      const newMsg = {
        userId: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
        content: 10
      }

      // @ts-expect-error
      await expect(async () => await messageModel.save(newMsg)).rejects.toThrowError('Message content must be a string')
    })

    it('throws if "userId" parameter is not a string', async () => {
      const newMsg = {
        userId: 12,
        content: 'Test'
      }

      // @ts-expect-error
      await expect(async () => await messageModel.save(newMsg)).rejects.toThrowError('Message userId must be a string')
    })
  })
})
