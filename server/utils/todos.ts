import { prisma } from './prisma'
import type { PaginatedTodos, Todo } from '~/types/todo'

type PrismaTodo = {
  id: number
  title: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

function serializeTodo(todo: PrismaTodo): Todo {
  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  }
}

export async function getTodos(
  page = 1,
  limit = 10,
): Promise<PaginatedTodos> {
  const currentPage = Math.max(1, page)
  const pageSize = Math.min(50, Math.max(1, limit))
  const skip = (currentPage - 1) * pageSize

  const [data, total] = await Promise.all([
    prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.todo.count(),
  ])

  return {
    data: data.map(serializeTodo),
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  }
}

export async function getTodoById(id: number): Promise<Todo | null> {
  if (Number.isNaN(id)) {
    return null
  }

  const todo = await prisma.todo.findUnique({
    where: { id },
  })

  return todo ? serializeTodo(todo) : null
}
