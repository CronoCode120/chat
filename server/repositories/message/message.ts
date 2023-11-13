import { Client, Row } from '@libsql/client'
import { sqlClient } from '../../SqlClient.ts'

import { MessageInput } from '../../../schemas/validateMsg.ts'
import { ServerError } from '../../../errors/ServerError.ts'

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

export class MessageModel implements Repository {
  readonly client

  constructor() { //eslint-disable-line
    this.client = sqlClient
  }

  async getAllFromOffset (serverOffset = 0): Promise<Row[] | undefined> {
    const results = await this.client.execute({
      sql: 'SELECT id, content, username FROM messages WHERE id > ?;',
      args: [serverOffset]
    })

    return results.rows
  }

  async save ({ content, username }: MessageInput): Promise<string> {
    const result = await this.client.execute({
      sql: 'INSERT INTO messages (content, username) VALUES (:content, :username);',
      args: { content, username }
    })

    if (result.lastInsertRowid === undefined) throw new ServerError('Could not get last message id')

    return result.lastInsertRowid.toString()
  }

  async reset (): Promise<void> {
    await this.client.executeMultiple(`
      DROP TABLE messages;
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        username VARCHAR(40)
      )
    `)
  }

  disconnect (): void {
    this.client.close()
  }
}
