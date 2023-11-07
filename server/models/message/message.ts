import { Row, createClient } from "@libsql/client";
import { configDotenv } from "dotenv";

type AuthObj = {
    serverOffset: number
    userId: number
}

type Message = {
    content: string
    id: number
    userId: number
}

interface IMessageModel {
    socketAuth: AuthObj
    getAllFromOffset(): Promise<Row[] | undefined>
    save({ content, userId }: { content: string, userId: number }): Promise<bigint | undefined>
}

configDotenv()

const db = createClient({
    url: 'libsql://top-fantomette-cronocode120.turso.io',
    authToken: process.env.DB_TOKEN
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user VARCHAR(40)
  )
`)

export class MessageModel implements IMessageModel {
    socketAuth: AuthObj;

    constructor({ socketAuth }: { socketAuth: AuthObj }) {
        this.socketAuth = socketAuth
    }

    async getAllFromOffset() {
        const results = await db.execute({
            sql: 'SELECT id, content, user FROM messages WHERE id > ?',
            args: [this.socketAuth.serverOffset ?? 0]
        })
        return results.rows

    }

    async save({ content, userId }: { content: string, userId: number }) {
        const result = await db.execute({
            sql: 'INSERT INTO messages (content, userId) VALUES (:content, :userId)',
            args: { content, userId }
        })

        return result.lastInsertRowid
    }
}