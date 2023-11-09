import { ZodSchema } from 'zod'

export function validateSchema ({ schema, params }: { schema: ZodSchema, params: unknown }): any {
  const result = schema.safeParse(params)

  if (!result.success) {
    return result
  }

  return result.data
}
