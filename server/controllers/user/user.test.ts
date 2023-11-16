import { describe, it, expect, vi } from 'vitest'
import { UserController } from './user.ts'
import { User } from '../../models/User.ts'

const mockUsername = 'user'
const mockPassword = 'password'
const mockId = '1234'

const mockUser = { id: mockId, username: mockUsername, password: mockPassword }

const res: any = {
  status: vi.fn(() => res),
  json: vi.fn()
}

const userRepository: any = {
  save: vi.fn(),
  findById: vi.fn(async () => await Promise.resolve(mockUser))
}
const generateUUID: any = vi.fn(() => mockId)

describe('UserController', () => {
  const userController = new UserController({ generateUUID, userRepository })
  describe('REGISTER USER', () => {
    const req: any = { body: mockUser }

    it('calls "generateUUID"', async () => {
      await userController.register(req, res)
      expect(generateUUID).toBeCalled()
    })

    it('calls "save" in UserRepository with an User instance', async () => {
      await userController.register(req, res)
      expect(userRepository.save).toBeCalled()
      expect(userRepository.save.mock.calls[0][0]).toBeInstanceOf(User)
    })

    it('responds with a status 201 and success as true', async () => {
      await userController.register(req, res)
      expect(res.status).toBeCalledWith(201)
      expect(res.json).toBeCalledWith({ success: true })
    })
  })

  describe('FIND BY ID', () => {
    const req: any = { body: { id: '::id::' } }

    it('calls "findById" in UserRepository', async () => {
      await userController.findById(req, res)
      expect(userRepository.findById).toBeCalled()
    })

    it('responds with a status 200 and the found user', async () => {
      await userController.findById(req, res)
      expect(res.status).toBeCalledWith(200)
      expect(res.json).toBeCalledWith({ user: mockUser })
    })
  })
})
