import { getTodos } from '../../utils/todos'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10))

  try {
    return await getTodos(page, limit)
  } catch (error) {
    console.error('[GET /api/todos]', error)

    const message = error instanceof Error ? error.message : 'Database request failed'

    if (
      message.includes('denied access')
      || message.includes('pool timeout')
      || message.includes('ECONNREFUSED')
      || message.includes('ENOTFOUND')
    ) {
      throw createError({
        statusCode: 503,
        statusMessage:
          'Database connection failed. Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME, then run bun run db:push.',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load todos',
    })
  }
})
