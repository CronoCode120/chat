import { Request, Response } from 'express'
import { UserRepository } from '../../repositories/user/user.ts'
import { User } from '../../models/User.ts'
import { NotFoundError } from '../../errors/NotFound.ts'

interface Props {
  userRepository: UserRepository
  generateUUID: () => string
}

export class UserController {
  repository
  readonly generateUUID

  constructor({ userRepository, generateUUID }: Props) { // eslint-disable-line
    this.repository = userRepository
    this.generateUUID = generateUUID
  }

  register = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body
    const user = User.create({ id: this.generateUUID(), username, password })

    await this.repository.save(user)

    res.status(201).json({ success: true })
  }

  findById = async (req: Request, res: Response): Promise<void> => {
    const result = await this.repository.findById(req.body.id)

    if (result === null) throw new NotFoundError('User not found')

    res.status(200).json({ user: result })
  }
}
