import { prisma } from '@/utils/prisma'
import {
  updateTodoSchema,
  validationErrorResponse,
} from '@/utils/todo-validation'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: {
        error: 'Validation failed',
        fieldErrors: { title: 'Invalid todo id' },
      },
    })
  }

  const body = await readBody(event)
  const parsed = updateTodoSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: validationErrorResponse(parsed.error),
    })
  }

  try {
    return await prisma.todo.update({
      where: { id },
      data: parsed.data,
    })
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Todo not found',
    })
  }
})
