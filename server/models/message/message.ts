import { Row, createClient } from '@libsql/client'
import { configDotenv } from 'dotenv'

import { validateMsg, MessageInput } from '../../schemas/validateMsg.ts'

// interface AuthObj {
//   serverOffset: number
//   userId: number
// }

export interface Repository {
  connect?: () => Promise<void>
  reset: () => Promise<void>
  disconnect: () => void
}

interface MsgModel {
  getAllFromOffset: ({ serverOffset }: { serverOffset: number }) => Promise<Row[] | undefined>
  save: (message: MessageInput) => Promise<bigint | undefined>
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
  async getAllFromOffset ({ serverOffset = 0 }: { serverOffset?: number } = {}): Promise<Row[] | undefined> {
    const results = await db.execute({
      sql: 'SELECT id, content, user_id FROM messages WHERE id > ?;',
      args: [serverOffset]
    })
    return results.rows
  }

  async save (message: MessageInput): Promise<bigint | undefined> {
    const params = validateMsg(message)
    if (!params.success) {
      throw new Error(params.error.message)
    }

    const { content, userId } = params.data
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
