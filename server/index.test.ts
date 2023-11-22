import { describe, expect, it } from 'vitest'
import supertest from 'supertest'
import { app } from './index.ts'

describe('Server integration', () => {
  describe('REGISTER USER', () => {
    it('user is registered properly', async () => {
      const res = await supertest(app)
        .post('/user/register')
        .send({
          username: 'John Doy',
          password: 'password'
        })

      expect(res.status).toStrictEqual(201)
      expect(res.body.success).toBe(true)

      const { body, status } = await supertest(app)
        .post('/user/login')
        .send({
          username: 'John Doe',
          password: 'password'
        })

      expect(status).toStrictEqual(200)
      expect(body).toBeDefined()
      expect(typeof body.token).toBe('string')
    })
  })
})
