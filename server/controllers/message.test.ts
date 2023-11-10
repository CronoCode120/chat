import { describe, it, expect, vi } from 'vitest'
import { MessageController } from './message.ts'

const mockMessages = [
  {
    content: 'Message 1',
    id: 1,
    user_id: '1'
  },
  {
    content: 'Message 2',
    id: 2,
    user_id: '2'
  },
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

describe('MessageController', () => {
  describe('offsetMessages', () => {
    it('calls getAllFromOffset in MessageModel with an offset value', async () => {
      const mockMsgModel = {
        getAllFromOffset: vi.fn()
      }
      // @ts-expect-error
      const msgController = new MessageController({ messageModel: mockMsgModel })

      await msgController.offsetMessages(2)

      expect(mockMsgModel.getAllFromOffset).toBeCalledWith(2)
    })

    it('emits all messages to the client', async () => {
      const mockMsgModel = {
        getAllFromOffset: vi.fn(async () => await Promise.resolve(mockMessages))
      }
      const mockSocket = {
        emit: vi.fn()
      }
      // @ts-expect-error
      const msgController = new MessageController({ messageModel: mockMsgModel, socket: mockSocket })

      await msgController.offsetMessages(2)

      expect(mockSocket.emit).toHaveBeenNthCalledWith(1, 'chat message', ...Object.values(mockMessages[0]))
      expect(mockSocket.emit).toHaveBeenNthCalledWith(2, 'chat message', ...Object.values(mockMessages[1]))
    })
  })

  describe('save', () => {
    it('', () => { })
  })
})
