import { describe, it, expect, vi } from 'vitest'
import { MessageController } from './message.ts'
import { validateMsg } from '../../schemas/validateMsg.ts'
import * as validateMsgModule from '../../schemas/validateMsg.ts'

vi.spyOn(validateMsgModule, 'validateMsg')

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

    it('calls validation function with the message params', async () => {
      const msgController = setupMsgController(mockMsgModel)

      await msgController.save('message')

      expect(validateMsg).toBeCalledWith({ content: 'message', username: mockUsername })
    })
  })
})
