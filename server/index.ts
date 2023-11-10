import express from 'express'
import { configDotenv } from 'dotenv'
import { createClient } from '@libsql/client'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

configDotenv()

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})

const db = createClient({
  url: 'libsql://top-fantomette-cronocode120.turso.io',
  authToken: process.env.DB_TOKEN
})

io.on('connection', async (socket) => {
  console.log('An user has connected!')

  if (!socket.recovered) {
    let results
    try {
      console.log(db)
      results = await db.execute({
        sql: 'SELECT id, content, user FROM messages WHERE id > ?',
        args: [socket.handshake.auth.serverOffset ?? 0]
      })
    } catch (e) {
      console.error(e)
      return
    }

    results?.rows.forEach(row => {
      socket.emit('chat message', row.content, row.id?.toString(), row.user)
    })
  }

  socket.on('chat message', async (msg: string) => {
    const username: string = socket.handshake.auth.username ?? 'anonymous'
    console.log({ username })

    let result
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content, user) VALUES (:msg, :username)',
        args: { msg, username }
      })
    } catch (e) {
      console.error(e)
      return
    }

    io.emit('chat message', msg, result.lastInsertRowid?.toString(), username) // POSIBLE UNDEFINED
  })

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
