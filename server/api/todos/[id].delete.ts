import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid todo id',
    })
  }

  try {
    await prisma.todo.delete({
      where: { id },
    })

    return { success: true }
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Todo not found',
    })
  }
})
