import { describe, expect, it, beforeEach } from 'vitest'
import supertest from 'supertest'
import { Server } from './Server.ts'

const server = new Server()
const app = server.app

describe('Server integration', () => {
  beforeEach(async () => await server.reset())

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
          username: 'John Doy',
          password: 'password'
        })

      expect(status).toStrictEqual(200)
      expect(body).toBeDefined()
      expect(typeof body.token).toBe('string')
      expect(body.token).toMatch('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.')
    })
  })
})
