import { Router } from 'express'
import { UserController } from '../controllers/user/user.ts'

import { UserRepository } from '../repositories/user/user.ts'
import { GenerateUUID } from '../models/generateUUID.ts'
import { GenerateToken } from '../models/generateToken.ts'

export interface UserRouterParams {
  userRepository: UserRepository
  generateUUID: GenerateUUID
  generateToken: GenerateToken
}

export const createUserRouter = ({
  userRepository,
  generateUUID,
  generateToken
}: UserRouterParams
): Router => {
  const router = Router()

  const userController = new UserController({
    userRepository,
    generateUUID,
    generateToken
  })

  router.post('/register', userController.register) // eslint-disable-line
  router.post('/login', userController.login) // eslint-disable-line

  return router
}
