import express from 'express'
import { createServer } from 'node:http'
import { MessageRepository } from './repositories/message/message.ts'
import { UserRepository } from './repositories/user/user.ts'
import { GenerateUUID, generateUUID } from './models/generateUUID.ts'
import { createUserRouter } from './routes/user.ts'
import { GenerateToken, generateToken } from './models/generateToken.ts'
import { configDotenv } from 'dotenv'
import { createSocket, initSocket } from './socket.ts'

interface ServerDependencies {
  msgRepository: MessageRepository
  userRepository: UserRepository
  uuidGenerator: GenerateUUID
  tokenGenerator: GenerateToken
}

export class Server {
  readonly dependencies
  readonly app
  readonly http
  socket

  constructor() { // eslint-disable-line
    configDotenv()

    this.dependencies = this.createDependencies()
    this.app = express()
    this.http = createServer(this.app)
    this.socket = createSocket(this.http)

    this.app.use(express.json())
    this.app.use('/user', this.generateUserRouter())

    this.app.get('/', (req, res) => {
      res.sendFile(process.cwd() + '/client/index.html')
    })
  }

  createDependencies (): ServerDependencies {
    const msgRepository = new MessageRepository()
    const userRepository = new UserRepository()

    const uuidGenerator = generateUUID
    const tokenGenerator = generateToken

    return { msgRepository, userRepository, uuidGenerator, tokenGenerator }
  }

  generateUserRouter (): express.Router {
    const params = {
      userRepository: this.dependencies.userRepository,
      generateToken: this.dependencies.tokenGenerator,
      generateUUID: this.dependencies.uuidGenerator
    }

    return createUserRouter(params)
  }

  startSocket (): void {
    initSocket({
      io: this.socket,
      msgRepository: this.dependencies.msgRepository
    })
  }

  async reset (): Promise<void> {
    await this.dependencies.msgRepository.reset()
    await this.dependencies.userRepository.reset()
  }

  disconnect (): void {
    this.dependencies.msgRepository.disconnect()
    this.dependencies.userRepository.disconnect()
  }

  listen (): void {
    const port = process.env.PORT ?? 3000

    this.http.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }
}
