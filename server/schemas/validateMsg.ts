import { z } from 'zod'

export const msgInputSchema = z.object({
  content: z.string({
    required_error: 'Message must have content',
    invalid_type_error: 'Message content must be a string'
  }).min(1, 'Message content cannot be empty'),
  username: z.string({
    required_error: 'Message must include username',
    invalid_type_error: 'Message username must be a string'
  })
})

export type MessageInput = z.infer<typeof msgInputSchema>

export const validateMsg = (msg: MessageInput): z.SafeParseReturnType<MessageInput, MessageInput> => msgInputSchema.safeParse(msg)
