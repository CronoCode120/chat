import { describe, it, expect, vi } from 'vitest'
import { UserController } from './user.ts'

const mockUsername = 'user'
const mockPassword = 'password'
const mockId = '1234'

const setupUserController = (userRepository: any): UserController => {
  return new UserController(userRepository)
}

describe('UserController', () => {
  describe('OFFSET MESSAGES', () => {
    it('calls getAllFromOffset in MessageModel with an offset value', async () => {
      const mockMsgModel = { getAllFromOffset: vi.fn() }

      const msgController = setupUserController(mockMsgModel)

      await msgController.offsetMessages()

      expect(mockMsgModel.getAllFromOffset).toBeCalledWith(mockServerOffset)
    })

    it('emits all messages to the client', async () => {
      const mockMsgModel = { getAllFromOffset: vi.fn(async () => await Promise.resolve(mockMessages)) }

      const msgController = setupUserController(mockMsgModel)

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

      const msgController = setupUserController(mockMsgModel)

      await msgController.save(msg)

      expect(mockMsgModel.save).toBeCalledWith({ content: msg, username: mockUsername })
    })

    it('emits expected message and serverOffset', async () => {
      const msg = 'Mensaje'

      const msgController = setupUserController(mockMsgModel)

      await msgController.save(msg)

      expect(mockServer.emit).toBeCalledWith(socketEvent, msg, mockServerOffset, mockUsername)
    })
  })
})
