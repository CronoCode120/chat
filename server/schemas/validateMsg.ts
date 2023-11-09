import { z } from 'zod'
import { validateSchema } from './validateSchema.ts'

export const msgInputSchema = z.object({
  content: z.string({
    required_error: 'Message must have content',
    invalid_type_error: 'Message content must be a string'
  }).min(1, 'Message content cannot be empty'),
  userId: z.string({
    required_error: 'Message must include userId',
    invalid_type_error: 'Message userId must be a string'
  })
})

export type MessageInput = z.infer<typeof msgInputSchema>

export const validateMsg = (msg: MessageInput): z.SafeParseError<MessageInput> | MessageInput => validateSchema({ schema: msgInputSchema, params: msg })
