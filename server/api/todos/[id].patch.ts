import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid todo id',
    })
  }

  const body = await readBody<{ title?: string; completed?: boolean }>(event)
  const data: { title?: string; completed?: boolean } = {}

  if (typeof body?.title === 'string') {
    const title = body.title.trim()
    if (!title) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title is required',
      })
    }
    data.title = title
  }

  if (typeof body?.completed === 'boolean') {
    data.completed = body.completed
  }

  if (Object.keys(data).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No valid fields to update',
    })
  }

  try {
    return await prisma.todo.update({
      where: { id },
      data,
    })
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Todo not found',
    })
  }
})
