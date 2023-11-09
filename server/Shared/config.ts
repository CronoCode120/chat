import { configDotenv } from 'dotenv'

configDotenv()

export const config = {
  sqlLite: {
    url: 'libsql://top-fantomette-cronocode120.turso.io',
    authToken: process.env.DB_TOKEN
  }
}
