import { Server, Socket } from 'socket.io'
import { IMessageModel } from '../models/repositories/message/message.ts'
import { validateMsg } from '../schemas/validateMsg.ts'
import { InvalidParamsError } from '../errors/InvalidParams.ts'

export class MessageController {
  readonly messageModel
  client: Socket
  server: Server

  constructor({ messageModel, client, server }: { messageModel: IMessageModel, client: Socket, server: Server }) { // eslint-disable-line
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

  async save (content: string): Promise<void> {
    const username = this.client.handshake.auth.username
    const params = validateMsg({ content, username })
    if (!params.success) {
      throw new InvalidParamsError(params.error.message)
    }

    const msg = params.data
    const lastId = await this.messageModel.save(msg)

    this.server.emit('chat message', content, lastId, username)
  }
}
