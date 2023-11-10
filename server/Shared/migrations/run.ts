import { createClient } from '@libsql/client'
import { config } from '../config.ts'
import { up as up1699613483106 } from './1699613483106.ts'

const client = createClient({
  url: config.sqlLite.url,
  authToken: config.sqlLite.authToken
})

console.log('Running migrations...')
await up1699613483106(client)

console.log('1699613483106 Done!')

client.close()

console.log('Migrations completed!')
