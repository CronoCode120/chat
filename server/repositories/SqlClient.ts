import { createClient } from '@libsql/client'
import { config } from '../Shared/config.ts'

export const sqlClient = createClient({
  url: config.sqlLite.url,
  authToken: config.sqlLite.authToken
})
