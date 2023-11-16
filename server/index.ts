import express from 'express'
import { configDotenv } from 'dotenv'

import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { MessageModel } from './models/repositories/message/message.ts'
import { MessageController } from './controllers/message/message.ts'

configDotenv()

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})

const msgModel = new MessageModel()

io.on('connection', async (socket) => {
  const msgController = new MessageController({
    messageModel: msgModel,
    client: socket,
    server: io
  })

  console.log('An user has connected!')

  if (!socket.recovered) {
    await msgController.offsetMessages()
  }

  socket.on('chat message', async (msg: string) => await msgController.save(msg))

  socket.on('disconnect', () => {
    console.log('An user has disconnected')
  })
})

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
