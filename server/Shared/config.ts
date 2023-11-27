import { configDotenv } from 'dotenv'
import { checkEnv } from '../utils/checkEnv.ts'

configDotenv()
const envVars = [process.env.DB_TOKEN, process.env.SECRET]
checkEnv(envVars)

export const config = {
  sqlLite: {
    url: 'libsql://top-fantomette-cronocode120.turso.io',
    authToken: process.env.DB_TOKEN as string
  },
  jwt: {
    secret: process.env.SECRET as string
  },
  port: process.env.PORT ?? 3000
}
