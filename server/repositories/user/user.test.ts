import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { UserRepository } from './user.ts'
import { User } from '../../models/User.ts'

const mockId = '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000'
const mockName = 'cronocode'
const mockPassword = 'password'

describe('UserRepositorySql', () => {
  let userRepository: UserRepository

  beforeAll(async () => {
    userRepository = new UserRepository()
  })

  afterEach(async () => await userRepository.reset())

  afterAll(async () => userRepository.disconnect())

  const mockUser = User.create({ id: mockId, username: mockName, password: mockPassword })

  describe('findById and save', () => {
    it('gets the user with the provided id', async () => {
      await userRepository.save(mockUser)
      const user = await userRepository.findById(mockUser.id)

      expect(user).toEqual({ id: mockUser.id, username: mockUser.username, password: mockUser.getPassword() })
    })

    it('returns null if no user is found', async () => {
      await userRepository.save(mockUser)

      const user = await userRepository.findById('11bf5b37-e0b8-42e0-8dcf-dc8c4aefc001')

      expect(user).toBeNull()
    })
  })

  describe('findByUsername', () => {
    it('gets the user with the provided username', async () => {
      await userRepository.save(mockUser)
      const user = await userRepository.findByUsername(mockUser.username)

      expect(user).toEqual({ id: mockUser.id, username: mockUser.username, password: mockUser.getPassword() })
    })

    it('returns null if no user is found', async () => {
      await userRepository.save(mockUser)

      const user = await userRepository.findByUsername('cronocode1')

      expect(user).toBeNull()
    })
  })
})
