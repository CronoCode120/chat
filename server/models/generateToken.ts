import jwt from 'jsonwebtoken'
import { config } from '../Shared/config.ts'

export interface UserData {
  id: `${string}-${string}-${string}-${string}-${string}`
  username: string
}

export function generateToken (user: UserData): string {
  return jwt.sign(user, config.jwt.secret)
}
