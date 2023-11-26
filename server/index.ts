import { Server } from './Server.ts'

const server = new Server()
server.startSocket()
server.listen()
