import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { UserModel } from './users.ts'
import { UserInput } from '../../schemas/validateUser.ts'

describe('UserModelSql', () => {
  let userModel: UserModel

  beforeAll(async () => {
    userModel = new UserModel()
  })

  afterEach(async () => await userModel.reset())

  afterAll(async () => userModel.disconnect())

  describe('findById', () => {
    const mockUser = { id: '000001', username: 'cronocode', password: 'password' }

    it('gets the user with the provided id', async () => {
      UserModel.create(mockUser)

      const user = await userModel.findById(mockUser.id)

      expect(user).toEqual(mockUser)
    })

    it('gets all messages if serverOffset is not provided', async () => {
      const expectedMsg = newMessages.map((msg, idx) => ({ content: msg.content, id: idx + 1, username: msg.username }))

      await saveAllMsgs(newMessages)

      const messageArr = await userModel.getAllFromOffset()

      expect(messageArr).toEqual(expectedMsg)
    })
  })

  describe.skip('save', () => {
    it('saves a message properly', async () => {
      const newMsg = {
        content: 'Mensaje de prueba',
        username: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000'
      }

      const lastId = await userModel.save(newMsg)
      const result = await userModel.getAllFromOffset()

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
