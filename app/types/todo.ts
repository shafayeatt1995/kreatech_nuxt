export type Todo = {
  id: number
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export type PaginatedTodos = {
  data: Todo[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
