import { Client, Row } from '@libsql/client'
import { sqlClient } from '../SqlClient.ts'

import { validateMsg, MessageInput } from '../../schemas/validateMsg.ts'

// interface AuthObj {
//   serverOffset: number
//   userId: number
// }

export interface Repository {
  client: Client
  connect?: () => Promise<void>
  reset: () => Promise<void>
  disconnect: () => void
}

interface MsgModel {
  getAllFromOffset: ({ serverOffset }: { serverOffset: number }) => Promise<Row[] | undefined>
  save: (message: MessageInput) => Promise<bigint | undefined>
}

type IMessageModel = Repository & MsgModel

export class MessageModel implements IMessageModel {
  readonly client

  constructor() { //eslint-disable-line
    this.client = sqlClient
  }

  async getAllFromOffset ({ serverOffset = 0 }: { serverOffset?: number } = {}): Promise<Row[] | undefined> {
    const results = await this.client.execute({
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
    const result = await this.client.execute({
      sql: 'INSERT INTO messages (content, user_id) VALUES (:content, :userId);',
      args: { content, userId }
    })

    return result.lastInsertRowid
  }

  async reset (): Promise<void> {
    await this.client.executeMultiple(`
      DROP TABLE messages;
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        user_id VARCHAR(40)
      )
    `)
  }

  disconnect (): void {
    this.client.close()
  }
}
