import { Router } from 'express'
import { UserRepository } from '../repositories/user/user.ts'
import { UserController } from '../controllers/user/user.ts'
import { generateUUID } from '../models/generateUUID.ts'
import { generateToken } from '../models/generateToken.ts'

export const router = Router()

const userRepository = new UserRepository()
const userController = new UserController({
  userRepository,
  generateUUID,
  generateToken
})

router.post('/register', userController.register) // eslint-disable-line

router.post('/login', userController.login) // eslint-disable-line
