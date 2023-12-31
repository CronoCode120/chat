import { Client } from '@libsql/client/http'
import { Repository } from '../message/message.ts'
import { sqlClient } from '../SqlClient.ts'
import { UserType } from '../../schemas/validateUser.ts'
import { User } from '../../models/User.ts'

export class UserRepository implements Repository {
  client: Client

  constructor() { // eslint-disable-line
    this.client = sqlClient
  }

  async save (user: User): Promise<void> {
    await this.client.execute({
      sql: 'INSERT INTO users (id, username, password) VALUES (:id, :username, :password);',
      args: {
        id: user.id,
        username: user.username,
        password: user.getPassword()
      }
    })
  }

  async findById (id: string): Promise<UserType | null> {
    const result = await this.client.execute({
      sql: 'SELECT id, username, password FROM users WHERE id = ?;',
      args: [id]
    })
    if (result.rows.length === 0) return null
    return result.rows[0] as unknown as UserType
  }

  async findByUsername (username: string): Promise<UserType | null> {
    const result = await this.client.execute({
      sql: 'SELECT id, username, password FROM users WHERE username = ?;',
      args: [username]
    })
    if (result.rows.length === 0) return null
    return result.rows[0] as unknown as UserType
  }

  async reset (): Promise<void> {
    await this.client.executeMultiple(`
      DROP TABLE users;
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username VARCHAR(40) NOT NULL UNIQUE,
        password VARCHAR(60) NOT NULL
      );
    `)
  }

  disconnect (): void {
    this.client.close()
  }
}
