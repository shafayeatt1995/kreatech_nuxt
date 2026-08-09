import { prisma } from '@/utils/prisma'
import {
  createTodoSchema,
  validationErrorResponse,
} from '@/utils/todo-validation'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = createTodoSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: validationErrorResponse(parsed.error),
    })
  }

  return prisma.todo.create({
    data: { title: parsed.data.title },
  })
})
