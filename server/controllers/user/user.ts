import { Request, Response } from 'express'
import { UserRepository } from '../../repositories/user/user.ts'
import { User } from '../../models/User.ts'
import { comparePassword } from '../../utils/hashPassword.ts'
import { NotFoundError } from '../../errors/NotFound.ts'
import { InvalidParamsError } from '../../errors/InvalidParams.ts'

import { UserData } from '../../models/generateToken.ts'

interface Props {
  userRepository: UserRepository
  generateUUID: () => string
  generateToken: ({ id, username }: UserData) => string
}

export class UserController {
  repository
  readonly generateUUID
  readonly generateToken

  constructor({ userRepository, generateUUID, generateToken }: Props) { // eslint-disable-line
    this.repository = userRepository
    this.generateUUID = generateUUID
    this.generateToken = generateToken
  }

  register = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body

    const usernameExists = await this.repository.findByUsername(username) !== null
    if (usernameExists) throw new InvalidParamsError('Username already in use')

    const user = User.create({ id: this.generateUUID(), username, password })

    await this.repository.save(user)

    res.status(201).json({ success: true })
  }

  login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body

    const user = await this.repository.findByUsername(username)

    const passwordCorrect = user === null
      ? false
      : comparePassword(password, user.password)

    if (!passwordCorrect) throw new InvalidParamsError('Username or password is incorrect')

    // @ts-expect-error
    const token = this.generateToken({ id: user.id, username: user.username })

    res.status(200).json({ token, username: user?.username })
  }

  findById = async (req: Request, res: Response): Promise<void> => {
    const result = await this.repository.findById(req.body.id)

    if (result === null) throw new NotFoundError('User not found')

    res.status(200).json({ user: result })
  }
}
