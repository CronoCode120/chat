import { z } from 'zod'
import { InvalidParamsError } from '../errors/InvalidParams.ts'

const userSchema = z.object({
  id: z.string({
    required_error: 'User must have an id',
    invalid_type_error: 'User id must be a string'
  }),
  username: z.string({
    required_error: 'User must have a name',
    invalid_type_error: 'User name must be a string'
  }).min(4, 'User name must have at least 4 characters'),
  password: z.string({
    required_error: 'User must have a password',
    invalid_type_error: 'User password must be a string'
  }).min(6, 'User password must have at least 6 characters')
})

export type UserType = z.infer<typeof userSchema>

export function validateUser (user: UserType): UserType {
  const params = userSchema.safeParse(user)
  if (!params.success) throw new InvalidParamsError(params.error.message)

  return params.data
}
