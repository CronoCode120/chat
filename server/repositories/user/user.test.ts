import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { UserRepository } from './user.ts'
import { User } from '../../models/User.ts'
import { UserInput } from '../../schemas/validateUser.ts'

describe('UserRepositorySql', () => {
  let userRepository: UserRepository

  beforeAll(async () => {
    userRepository = new UserRepository()
  })

  afterEach(async () => await userRepository.reset())

  afterAll(async () => userRepository.disconnect())

  describe('findById', () => {
    const mockUser = { id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000', username: 'cronocode', password: 'password' }

    it('gets the user with the provided id', async () => {
      await userRepository.save(mockUser)
      const user = await userRepository.findById(mockUser.id)

      expect(user).toEqual({ id: mockUser.id, username: mockUser.username })
    })

    it('returns null if no user is found', async () => {
      const user = await userRepository.findById(mockUser.id)

      expect(user).toBeNull()
    })
  })

  describe.skip('save', () => {
    it('saves a message properly', async () => {
      const newMsg = {
        content: 'Mensaje de prueba',
        username: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000'
      }

      const lastId = await userRepository.save(newMsg)
      const result = await userRepository.getAllFromOffset()

      const expectedMsg = {
        content: 'Mensaje de prueba',
        username: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
        id: 1
      }

      expect(result[0]).toEqual(expectedMsg)
      expect(lastId).toBe('1')
    })
  })
})
