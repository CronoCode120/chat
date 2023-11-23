import { randomUUID } from 'node:crypto'

export const generateUUID = (): `${string}-${string}-${string}-${string}-${string}` => randomUUID()
