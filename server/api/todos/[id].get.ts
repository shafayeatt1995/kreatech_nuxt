import { getTodoById } from '../../utils/todos'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid todo id',
    })
  }

  const todo = await getTodoById(id)

  if (!todo) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Todo not found',
    })
  }

  return todo
})
