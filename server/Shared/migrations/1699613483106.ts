import { Client } from '@libsql/client'

export async function up (client: Client): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      user_id VARCHAR(40)
    );
  `)
}

export async function down (client: Client): Promise<void> {
  await client.execute('DROP TABLE IF EXISTS messages;')
}
