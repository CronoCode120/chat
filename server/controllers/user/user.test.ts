import { describe, it, expect, vi, afterEach } from 'vitest'
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
  findById: vi.fn(async () => await Promise.resolve(mockUser)),
  findByUsername: vi.fn(async () => await Promise.resolve(null))
}
const generateUUID: any = vi.fn(() => mockId)

describe('UserController', () => {
  const userController = new UserController({ generateUUID, userRepository })
  const req: any = { body: { username: mockUsername, password: mockPassword } }

  afterEach(() => { vi.clearAllMocks() })

  describe('REGISTER USER', () => {
    it('calls "generateUUID"', async () => {
      await userController.register(req, res)
      expect(generateUUID).toBeCalled()
    })

    it('calls "save" in UserRepository with an User instance', async () => {
      await userController.register(req, res)
      expect(userRepository.save).toBeCalled()
      expect(userRepository.save.mock.calls[0][0]).toBeInstanceOf(User)
    })

    it('calls "findByUsername" with the username', async () => {
      await userController.register(req, res)
      expect(userRepository.findByUsername).toBeCalledWith(mockUsername)
    })

    it('responds with a status 201 and success as true', async () => {
      await userController.register(req, res)
      expect(res.status).toBeCalledWith(201)
      expect(res.json).toBeCalledWith({ success: true })
    })

    it('throws an error if username is already in use', async () => {
      const mockRepository = {
        save: vi.fn(),
        findByUsername: vi.fn(async () => await Promise.resolve('::user::'))
      }
      // @ts-expect-error
      const controller = new UserController({ userRepository: mockRepository, generateUUID })

      await expect(async () => await controller.register(req, res)).rejects.toThrowError('Username already in use')
      expect(mockRepository.findByUsername).toBeCalled()
    })
  })

  describe('LOG IN', () => {
    it('throws an error if username does not exist', async () => {
      const mockRepository = {
        findByUsername: vi.fn(async () => await Promise.resolve(null))
      }
      // @ts-expect-error
      const controller = new UserController({ userRepository: mockRepository, generateUUID })

      await expect(async () => await controller.login(req, res)).rejects.toThrowError('Username or password is incorrect')
    })

    it('throws an error if password does not match', async () => {
      const user = {
        username: mockUsername,
        password: 'Password',
        id: mockId
      }
      const mockRepository = {
        findByUsername: vi.fn(async () => await Promise.resolve(user))
      }
      // @ts-expect-error
      const controller = new UserController({ userRepository: mockRepository, generateUUID })

      await expect(async () => await controller.login(req, res)).rejects.toThrowError('Username or password is incorrect')
    })

    it('responds with a token if credentials are correct', async () => {
      const mockRepository = {
        findByUsername: vi.fn(async () => await Promise.resolve(mockUser))
      }
      // @ts-expect-error
      const controller = new UserController({ userRepository: mockRepository, generateUUID })

      await controller.login(req, res)

      expect(res.status).toBeCalledWith(200)
      expect(res.json).toBeCalledWith({ token: '::token::' })
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
