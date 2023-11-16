import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { MessageRepository } from './message.ts'
import { MessageInput } from '../../schemas/validateMsg.ts'

describe('MessageRepositorySql', () => {
  let messageRepository: MessageRepository, saveAllMsgs: (msgArr: MessageInput[]) => Promise<void>

  beforeAll(async () => {
    messageRepository = new MessageRepository()

    saveAllMsgs = async (msgArr: MessageInput[]): Promise<void> => {
      for (const msg of msgArr) {
        await messageRepository.save(msg)
      }
    }
  })

  afterEach(async () => await messageRepository.reset())

  afterAll(async () => messageRepository.disconnect())

  describe('getAllFromOffset', () => {
    const newMessages = [
      { content: 'Message 1', username: '1' },
      { content: 'Message 2', username: '2' },
      { content: 'Message 3', username: '3' },
      { content: 'Message 4', username: '4' }
    ]

    it('gets all messages from a provided offset', async () => {
      const expectedMsg = [
        { content: 'Message 3', id: 3, username: '3' },
        { content: 'Message 4', id: 4, username: '4' }
      ]

      await saveAllMsgs(newMessages)

      const messageArr = await messageRepository.getAllFromOffset(2)

      expect(messageArr).toEqual(expectedMsg)
    })

    it('gets all messages if serverOffset is not provided', async () => {
      const expectedMsg = newMessages.map((msg, idx) => ({ content: msg.content, id: idx + 1, username: msg.username }))

      await saveAllMsgs(newMessages)

      const messageArr = await messageRepository.getAllFromOffset()

      expect(messageArr).toEqual(expectedMsg)
    })
  })

  describe('save', () => {
    it('saves a message properly', async () => {
      const newMsg = {
        content: 'Mensaje de prueba',
        username: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000'
      }

      const lastId = await messageRepository.save(newMsg)
      const result = await messageRepository.getAllFromOffset()

      const expectedMsg = {
        content: 'Mensaje de prueba',
        username: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
        id: 1
      }
      // @ts-expect-error
      expect(result[0]).toEqual(expectedMsg)
      expect(lastId).toBe('1')
    })
  })
})
