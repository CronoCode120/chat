import { randomUUID } from 'node:crypto'

export type GenerateUUID = () => `${string}-${string}-${string}-${string}-${string}`

export const generateUUID = (): `${string}-${string}-${string}-${string}-${string}` => randomUUID()
