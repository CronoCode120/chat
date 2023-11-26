import { Server, Socket } from 'socket.io'
import { validateMsg } from '../../schemas/validateMsg.ts'
import { MessageRepository } from '../../repositories/message/message.ts'

export class MessageController {
  readonly messageModel
  client: Socket
  server: Server

  constructor({ messageModel, client, server }: { messageModel: MessageRepository, client: Socket, server: Server }) { // eslint-disable-line
    this.messageModel = messageModel
    this.client = client
    this.server = server
  }

  async offsetMessages (): Promise<void> {
    const messages = await this.messageModel.getAllFromOffset(this.client.handshake.auth.serverOffset)

    messages?.forEach(msg => {
      this.client.emit('chat message', msg.content, msg.id, msg.username)
    })
  }

  save = async (content: string): Promise<void> => {
    const username = this.client.handshake.auth.username
    const msg = validateMsg({ content, username })

    const lastId = await this.messageModel.save(msg)

    this.server.emit('chat message', content, lastId, username)
  }
}
