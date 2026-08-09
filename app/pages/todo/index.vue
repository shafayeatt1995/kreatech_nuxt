<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-vue-next'
import DeleteConfirmModal from '~/components/todo/DeleteConfirmModal.vue'
import TodoFormModal from '~/components/todo/TodoFormModal.vue'
import type { PaginatedTodos, Todo } from '~/types/todo'
import type { TodoFieldErrors } from '~/utils/todo-validation'

function extractFieldErrors(error: unknown): TodoFieldErrors | undefined {
  if (
    error
    && typeof error === 'object'
    && 'data' in error
    && error.data
    && typeof error.data === 'object'
    && 'fieldErrors' in error.data
    && error.data.fieldErrors
    && typeof error.data.fieldErrors === 'object'
  ) {
    return error.data.fieldErrors as TodoFieldErrors
  }

  return undefined
}

const PAGE_SIZE = 10

const route = useRoute()
const router = useRouter()

const page = computed(() => Math.max(1, Number(route.query.page) || 1))

const { data: todosData, pending, error: fetchError, refresh } = await useAsyncData(
  () => `todos-${page.value}`,
  () => $fetch<PaginatedTodos>('/api/todos', {
    query: {
      page: page.value,
      limit: PAGE_SIZE,
    },
  }),
  {
    watch: [page],
  },
)

const submitting = ref(false)
const actionError = ref<string | null>(null)

const formOpen = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const selectedTodo = ref<Todo | null>(null)

const deleteOpen = ref(false)
const todoToDelete = ref<Todo | null>(null)

const todos = computed(() => todosData.value?.data ?? [])
const pagination = computed(() => todosData.value?.pagination ?? {
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPages: 1,
})

const error = computed(() => actionError.value ?? (fetchError.value ? 'Failed to load todos' : null))

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function openCreateModal() {
  formMode.value = 'create'
  selectedTodo.value = null
  formOpen.value = true
}

function openEditModal(todo: Todo) {
  formMode.value = 'edit'
  selectedTodo.value = todo
  formOpen.value = true
}

function openDeleteModal(todo: Todo) {
  todoToDelete.value = todo
  deleteOpen.value = true
}

async function handleFormSubmit(values: {
  title: string
  completed: boolean
}): Promise<TodoFieldErrors | void> {
  submitting.value = true
  actionError.value = null

  try {
    if (formMode.value === 'create') {
      await $fetch('/api/todos', {
        method: 'POST',
        body: { title: values.title },
      })
      formOpen.value = false
      selectedTodo.value = null
      await router.push({ path: '/todo', query: { page: 1 } })
      return
    }

    if (selectedTodo.value) {
      await $fetch(`/api/todos/${selectedTodo.value.id}`, {
        method: 'PATCH',
        body: values,
      })
      formOpen.value = false
      selectedTodo.value = null
      await refresh()
    }
  } catch (error) {
    const fieldErrors = extractFieldErrors(error)
    if (fieldErrors) {
      return fieldErrors
    }

    actionError.value = formMode.value === 'create'
      ? 'Failed to create todo'
      : 'Failed to update todo'
  } finally {
    submitting.value = false
  }
}

async function handleDeleteConfirm() {
  if (!todoToDelete.value) {
    return
  }

  submitting.value = true
  actionError.value = null

  try {
    await $fetch(`/api/todos/${todoToDelete.value.id}`, {
      method: 'DELETE',
    })

    deleteOpen.value = false
    todoToDelete.value = null

    const nextPage = todos.value.length === 1 && page.value > 1
      ? page.value - 1
      : page.value

    if (nextPage > 1) {
      await router.push({ path: '/todo', query: { page: nextPage } })
    } else {
      await router.push({ path: '/todo' })
    }
  } catch {
    actionError.value = 'Failed to delete todo'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900">
          Todos
        </h1>
        <p class="mt-1 text-sm text-gray-600">
          Manage todos with pagination, modals, and detail view.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        @click="openCreateModal"
      >
        <Plus class="h-4 w-4" />
        Create Todo
      </button>
    </div>

    <p
      v-if="error"
      class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </p>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Title
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="pending">
              <td colspan="4" class="px-6 py-10 text-center text-sm text-gray-500">
                Loading todos...
              </td>
            </tr>
            <tr v-else-if="todos.length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-sm text-gray-500">
                No todos found. Create your first todo.
              </td>
            </tr>
            <tr
              v-for="todo in todos"
              v-else
              :key="todo.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                {{ todo.title }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="todo.completed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
                >
                  {{ todo.completed ? 'Completed' : 'Pending' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDate(todo.createdAt) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <NuxtLink
                    :to="`/todo/${todo.id}`"
                    class="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Eye class="h-3.5 w-3.5" />
                    View
                  </NuxtLink>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    @click="openEditModal(todo)"
                  >
                    <Pencil class="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    @click="openDeleteModal(todo)"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-gray-600">
          Showing page {{ pagination.page }} of {{ pagination.totalPages }} ({{ pagination.total }} total)
        </p>
        <div class="flex items-center gap-2">
          <NuxtLink
            v-if="pagination.page > 1"
            :to="pagination.page - 1 > 1 ? { path: '/todo', query: { page: pagination.page - 1 } } : '/todo'"
            class="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <ChevronLeft class="h-4 w-4" />
            Previous
          </NuxtLink>
          <span
            v-else
            class="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-400 opacity-50"
          >
            <ChevronLeft class="h-4 w-4" />
            Previous
          </span>

          <NuxtLink
            v-if="pagination.page < pagination.totalPages"
            :to="{ path: '/todo', query: { page: pagination.page + 1 } }"
            class="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Next
            <ChevronRight class="h-4 w-4" />
          </NuxtLink>
          <span
            v-else
            class="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-400 opacity-50"
          >
            Next
            <ChevronRight class="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>

    <TodoFormModal
      :open="formOpen"
      :mode="formMode"
      :todo="selectedTodo"
      :submitting="submitting"
      :on-submit="handleFormSubmit"
      @close="formOpen = false; selectedTodo = null"
    />

    <DeleteConfirmModal
      :open="deleteOpen"
      :todo="todoToDelete"
      :submitting="submitting"
      @close="deleteOpen = false; todoToDelete = null"
      @confirm="handleDeleteConfirm"
    />
  </main>
</template>
