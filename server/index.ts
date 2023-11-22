import express from 'express'
import { createServer } from 'node:http'
import { createSocket, initSocket } from './socket.ts'
import { MessageRepository } from './repositories/message/message.ts'
import { configDotenv } from 'dotenv'
import { router } from './routes/user.ts'

configDotenv()

const port = process.env.PORT ?? 3000

export const app = express()
const server = createServer(app)

const msgRepository = new MessageRepository()

const io = createSocket(server)
initSocket({ io, msgRepository })

app.use(express.json())
app.use('/user', router)

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
