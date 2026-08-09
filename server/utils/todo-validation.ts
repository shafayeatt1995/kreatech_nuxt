import { z } from 'zod'

const titleSchema = z
  .string()
  .trim()
  .min(1, 'Title is required')
  .max(255, 'Title must be 255 characters or less')

export const createTodoSchema = z.object({
  title: titleSchema,
})

export const updateTodoSchema = z
  .object({
    title: titleSchema.optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => data.title !== undefined || data.completed !== undefined, {
    message: 'At least one field must be provided',
    path: ['title'],
  })

export const createTodoFormSchema = z.object({
  title: titleSchema,
  completed: z.boolean().optional(),
})

export const editTodoFormSchema = z.object({
  title: titleSchema,
  completed: z.boolean(),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
export type TodoFieldErrors = Partial<Record<'title' | 'completed', string>>

export function formatZodErrors(error: z.ZodError): TodoFieldErrors {
  const fieldErrors: TodoFieldErrors = {}

  for (const issue of error.issues) {
    const key = issue.path[0]
    if (
      (key === 'title' || key === 'completed')
      && !fieldErrors[key]
    ) {
      fieldErrors[key] = issue.message
    }
  }

  return fieldErrors
}

export function validationErrorResponse(error: z.ZodError) {
  return {
    error: 'Validation failed',
    fieldErrors: formatZodErrors(error),
  }
}
