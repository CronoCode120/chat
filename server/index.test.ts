import { describe, expect, it } from 'vitest'
import supertest from 'supertest'
import { app } from './index.ts'

describe('Server integration', () => {
  describe.skip('REGISTER USER', () => {
    it('user is registered properly', async () => {
      const res = await supertest(app)
        .post('/user/register')
        .send({
          username: 'John Doe',
          password: 'password'
        })

      expect(res.status).toStrictEqual(201)
      expect(res.body.success).toBe(true)
    })
  })
})
