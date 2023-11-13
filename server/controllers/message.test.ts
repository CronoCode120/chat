import { describe, it, expect, vi } from 'vitest'
import { MessageController } from './message.ts'

const mockMessages = [
  { content: 'Message 1', id: 1, username: '1' },
  { content: 'Message 2', id: 2, username: '2' },
  { content: 'Message 3', id: 3, username: '3' },
  { content: 'Message 4', id: 4, username: '4' }
]

const socketEvent = 'chat message'
const mockServerOffset = 2
const mockUsername = '123'

const mockSocket = {
  emit: vi.fn(),
  handshake: {
    auth: {
      username: mockUsername,
      serverOffset: mockServerOffset
    }
  }
}

const mockServer = {
  emit: vi.fn()
}

const setupMsgController = (messageModel: any, client: any = mockSocket, server: any = mockServer): MessageController => {
  return new MessageController({ messageModel, client, server })
}

describe('MessageController', () => {
  describe('OFFSET MESSAGES', () => {
    it('calls getAllFromOffset in MessageModel with an offset value', async () => {
      const mockMsgModel = { getAllFromOffset: vi.fn() }

      const msgController = setupMsgController(mockMsgModel)

      await msgController.offsetMessages()

      expect(mockMsgModel.getAllFromOffset).toBeCalledWith(mockServerOffset)
    })

    it('emits all messages to the client', async () => {
      const mockMsgModel = { getAllFromOffset: vi.fn(async () => await Promise.resolve(mockMessages)) }

      const msgController = setupMsgController(mockMsgModel)

      await msgController.offsetMessages()

      expect(mockSocket.emit).toHaveBeenNthCalledWith(1, socketEvent, ...Object.values(mockMessages[0]))
      expect(mockSocket.emit).toHaveBeenNthCalledWith(2, socketEvent, ...Object.values(mockMessages[1]))
    })
  })

  describe('SAVE', () => {
    const mockMsgModel = {
      save: vi.fn(async () => await Promise.resolve(2))
    }

    it('calls "save" in MessageModel with a content and username', async () => {
      const msg = 'Mensaje'

      const msgController = setupMsgController(mockMsgModel)

      await msgController.save(msg)

      expect(mockMsgModel.save).toBeCalledWith({ content: msg, username: mockUsername })
    })

    it('emits expected message and serverOffset', async () => {
      const msg = 'Mensaje'

      const msgController = setupMsgController(mockMsgModel)

      await msgController.save(msg)

      expect(mockServer.emit).toBeCalledWith(socketEvent, msg, mockServerOffset, mockUsername)
    })

    describe('PARAMS VALIDATIONS', () => {
      it('throws if "content" parameter is missing', async () => {
        const messageController = setupMsgController(mockMsgModel)
        // @ts-expect-error
        await expect(async () => await messageController.save()).rejects.toThrowError('Message must have content')
      })

      it('throws if "username" parameter is missing', async () => {
        const socket = { handshake: { auth: {} } }

        const msgController = setupMsgController(mockMsgModel, socket)
        const content = 'Test'

        await expect(async () => await msgController.save(content)).rejects.toThrowError('Message must include username')
      })

      it('throws if "content" parameter is not a string', async () => {
        const messageController = setupMsgController(mockMsgModel)
        const newMsg = 10

        // @ts-expect-error
        await expect(async () => await messageController.save(newMsg)).rejects.toThrowError('Message content must be a string')
      })

      it('throws if "username" parameter is not a string', async () => {
        const socket = { handshake: { auth: { username: 12 } } }

        const messageController = setupMsgController(mockMsgModel, socket)
        const newMsg = 'Test'

        await expect(async () => await messageController.save(newMsg)).rejects.toThrowError('Message username must be a string')
      })
    })
  })
})
