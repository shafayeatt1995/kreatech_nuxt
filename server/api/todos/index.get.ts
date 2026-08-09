import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  return prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  })
})
