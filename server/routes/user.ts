import { Router } from 'express'
import { UserRepository } from '../repositories/user/user.ts'
import { UserController } from '../controllers/user/user.ts'
import { generateUUID } from '../utils/generateUUID.ts'

export const router = Router()

const userRepository = new UserRepository()
const userController = new UserController({
  userRepository,
  generateUUID
})

router.post('/register', userController.register) // eslint-disable-line

router.post('/login', (req, res) => {
  res.status(200).json({ token: 'token' })
})
