<script setup lang="ts">
type Todo = {
  id: number
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

const todos = ref<Todo[]>([])
const title = ref('')
const loading = ref(true)
const submitting = ref(false)
const error = ref<string | null>(null)

async function loadTodos() {
  error.value = null
  todos.value = await $fetch<Todo[]>('/api/todos')
}

onMounted(async () => {
  try {
    await loadTodos()
  } catch {
    error.value = 'Failed to load todos'
  } finally {
    loading.value = false
  }
})

async function handleCreate() {
  const trimmedTitle = title.value.trim()
  if (!trimmedTitle) {
    return
  }

  submitting.value = true
  error.value = null

  try {
    const todo = await $fetch<Todo>('/api/todos', {
      method: 'POST',
      body: { title: trimmedTitle },
    })
    todos.value = [todo, ...todos.value]
    title.value = ''
  } catch {
    error.value = 'Failed to create todo'
  } finally {
    submitting.value = false
  }
}

async function toggleTodo(todo: Todo) {
  error.value = null

  try {
    const updated = await $fetch<Todo>(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      body: { completed: !todo.completed },
    })
    todos.value = todos.value.map((item) =>
      item.id === updated.id ? updated : item,
    )
  } catch {
    error.value = 'Failed to update todo'
  }
}

async function deleteTodo(id: number) {
  error.value = null

  try {
    await $fetch(`/api/todos/${id}`, { method: 'DELETE' })
    todos.value = todos.value.filter((item) => item.id !== id)
  } catch {
    error.value = 'Failed to delete todo'
  }
}
</script>

<template>
  <main class="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-8">
    <header>
      <h1 class="text-3xl font-semibold text-gray-900">
        Todo App
      </h1>
      <p class="mt-2 text-gray-600">
        Full-stack Nuxt + Prisma + MySQL
      </p>
    </header>

    <form class="flex gap-3" @submit.prevent="handleCreate">
      <input
        v-model="title"
        type="text"
        placeholder="What needs to be done?"
        class="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-gray-500"
      >
      <button
        type="submit"
        :disabled="submitting"
        class="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        Add
      </button>
    </form>

    <p
      v-if="error"
      class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </p>

    <p v-if="loading" class="text-gray-500">
      Loading todos...
    </p>
    <p
      v-else-if="todos.length === 0"
      class="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-gray-500"
    >
      No todos yet. Add your first one above.
    </p>
    <ul
      v-else
      class="divide-y divide-gray-200 rounded-lg border border-gray-200"
    >
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="flex items-center justify-between gap-4 px-4 py-3"
      >
        <label class="flex flex-1 items-center gap-3">
          <input
            type="checkbox"
            :checked="todo.completed"
            class="h-4 w-4 rounded border-gray-300"
            @change="toggleTodo(todo)"
          >
          <span
            :class="todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'"
          >
            {{ todo.title }}
          </span>
        </label>
        <button
          type="button"
          class="text-sm text-red-600 hover:text-red-700"
          @click="deleteTodo(todo.id)"
        >
          Delete
        </button>
      </li>
    </ul>
  </main>
</template>
