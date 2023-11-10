import { Socket } from 'socket.io'
import { IMessageModel } from '../models/message/message.ts'

export class MessageController {
  readonly messageModel
  socket

  constructor({ messageModel, socket }: { messageModel: IMessageModel, socket: Socket }) { // eslint-disable-line
    this.messageModel = messageModel
    this.socket = socket
  }

  async offsetMessages (offset = 0): Promise<void> {
    const messages = await this.messageModel.getAllFromOffset(offset)

    messages?.forEach(msg => {
      this.socket.emit('chat message', msg.content, msg.id, msg.user_id)
    })
  }
}
