import { Row, createClient } from '@libsql/client'
import { configDotenv } from 'dotenv'

// interface AuthObj {
//   serverOffset: number
//   userId: number
// }

interface Message {
  content: string
  id: number
  userId: number
}

interface Repository {
  connect?: () => Promise<void>
  reset: () => Promise<void>
  disconnect: () => void
}

interface MsgModel {
  getAllFromOffset: ({ serverOffset }: { serverOffset: number }) => Promise<Row[] | undefined>
  save: ({ content, userId }: { content: string, userId: string }) => Promise<bigint | undefined>
}

type IMessageModel = Repository & MsgModel

configDotenv()

const db = createClient({
  url: 'libsql://top-fantomette-cronocode120.turso.io',
  authToken: process.env.DB_TOKEN
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user_id VARCHAR(40)
  )
`)

export class MessageModel implements IMessageModel {
  async getAllFromOffset ({ serverOffset }: { serverOffset: number }): Promise<Row[] | undefined> {
    const results = await db.execute({
      sql: 'SELECT id, content, user_id FROM messages WHERE id > ?;',
      args: [serverOffset ?? 0]
    })
    return results.rows
  }

  async save ({ content, userId }: { content: string, userId: string }): Promise<bigint | undefined> {
    const result = await db.execute({
      sql: 'INSERT INTO messages (content, user_id) VALUES (:content, :userId);',
      args: { content, userId }
    })

    return result.lastInsertRowid
  }

  async reset (): Promise<void> {
    await db.executeMultiple(`
      DROP TABLE messages;
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        user_id VARCHAR(40)
      )
    `)
  }

  disconnect (): void {
    db.close()
  }
}
