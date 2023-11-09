import { createClient } from '@libsql/client'
import { config } from '../Shared/config.ts'

export const sqlClient = createClient({
  url: config.sqlLite.url,
  authToken: config.sqlLite.authToken
})

// await db.execute(`
//   CREATE TABLE IF NOT EXISTS messages (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     content TEXT,
//     user_id VARCHAR(40)
//   )
// `)
