<script setup lang="ts">
import { ArrowLeft, Calendar, CheckCircle2, Circle } from 'lucide-vue-next'
import type { Todo } from '~/types/todo'

const route = useRoute()

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(value))
}

const { data: todo, pending, error } = await useAsyncData(
  () => `todo-${route.params.id}`,
  () => $fetch<Todo>(`/api/todos/${route.params.id}`),
  {
    watch: [() => route.params.id],
  },
)
</script>

<template>
  <main class="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-8">
    <NuxtLink
      to="/todo"
      class="inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft class="h-4 w-4" />
      Back to todos
    </NuxtLink>

    <div
      v-if="pending"
      class="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm"
    >
      Loading todo...
    </div>

    <div
      v-else-if="error"
      class="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm"
    >
      Todo not found
    </div>

    <article
      v-else-if="todo"
      class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-medium uppercase tracking-wide text-gray-500">
            Todo #{{ todo.id }}
          </p>
          <h1 class="mt-2 text-3xl font-semibold text-gray-900">
            {{ todo.title }}
          </h1>
        </div>
        <span
          class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
          :class="todo.completed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
        >
          <CheckCircle2 v-if="todo.completed" class="h-4 w-4" />
          <Circle v-else class="h-4 w-4" />
          {{ todo.completed ? 'Completed' : 'Pending' }}
        </span>
      </div>

      <dl class="mt-8 space-y-4 border-t border-gray-200 pt-6">
        <div class="flex items-start gap-3">
          <Calendar class="mt-0.5 h-4 w-4 text-gray-400" />
          <div>
            <dt class="text-sm font-medium text-gray-500">
              Created
            </dt>
            <dd class="text-sm text-gray-900">
              {{ formatDate(todo.createdAt) }}
            </dd>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <Calendar class="mt-0.5 h-4 w-4 text-gray-400" />
          <div>
            <dt class="text-sm font-medium text-gray-500">
              Last updated
            </dt>
            <dd class="text-sm text-gray-900">
              {{ formatDate(todo.updatedAt) }}
            </dd>
          </div>
        </div>
      </dl>
    </article>
  </main>
</template>
