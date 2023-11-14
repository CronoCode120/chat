import { Client } from '@libsql/client'

export async function up (client: Client): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      username VARCHAR(40) NOT NULL UNIQUE,
      password VARCHAR(60) NOT NULL
    );
  `)
}

export async function down (client: Client): Promise<void> {
  await client.execute('DROP TABLE IF EXISTS users;')
}
