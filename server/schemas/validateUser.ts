import { z } from 'zod'

const userSchema = z.object({
  id: z.string({
    required_error: 'User must have an id',
    invalid_type_error: 'User id must be a string'
  }),
  username: z.string({
    required_error: 'User must have a name',
    invalid_type_error: 'User name must be a string'
  }),
  password: z.string({
    required_error: 'User must have a password',
    invalid_type_error: 'User password must be a string'
  }).min(6, 'User password must have at least 6 characters')
})

export type UserType = z.infer<typeof userSchema>

export const validateUser = (params: UserType): z.SafeParseReturnType<UserType, UserType> => userSchema.safeParse(params)
