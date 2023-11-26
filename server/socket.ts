import { Server } from 'socket.io'
import { MessageRepository } from './repositories/message/message.ts'
import { MessageController } from './controllers/message/message.ts'
import { Server as HttpServer } from 'http'

interface SocketArgs {
  io: Server
  msgRepository: MessageRepository
}

export function createSocket (server: HttpServer): Server {
  const io = new Server(server, {
    connectionStateRecovery: {}
  })

  return io
}

export function initSocket ({ io, msgRepository }: SocketArgs): void {
  io.on('connection', async (socket) => {
    const msgController = new MessageController({
      messageModel: msgRepository,
      client: socket,
      server: io
    })

    console.log('An user has connected!')

    if (!socket.recovered) await msgController.offsetMessages()

    socket.on('chat message', msgController.save)

    socket.on('disconnect', () => {
      console.log('An user has disconnected')
    })
  })
}
