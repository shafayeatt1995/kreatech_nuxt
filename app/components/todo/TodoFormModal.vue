<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { Todo } from '~/types/todo'

const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit'
  todo: Todo | null
  submitting: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [values: { title: string; completed: boolean }]
}>()

const title = ref('')
const completed = ref(false)

watch(
  () => [props.open, props.todo] as const,
  ([open, todo]) => {
    if (open) {
      title.value = todo?.title ?? ''
      completed.value = todo?.completed ?? false
    }
  },
  { immediate: true },
)

function handleSubmit() {
  const trimmedTitle = title.value.trim()
  if (!trimmedTitle) {
    return
  }

  emit('submit', { title: trimmedTitle, completed: completed.value })
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
  >
    <div class="w-full max-w-md rounded-xl bg-white shadow-xl">
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ mode === 'create' ? 'Create Todo' : 'Edit Todo' }}
        </h2>
        <button
          type="button"
          class="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close modal"
          @click="emit('close')"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <form class="space-y-4 px-6 py-5" @submit.prevent="handleSubmit">
        <div>
          <label
            for="todo-title"
            class="mb-1 block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="todo-title"
            v-model="title"
            type="text"
            placeholder="Enter todo title"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            autofocus
          >
        </div>

        <label
          v-if="mode === 'edit'"
          class="flex items-center gap-2 text-sm text-gray-700"
        >
          <input
            v-model="completed"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300"
          >
          Mark as completed
        </label>

        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {{ submitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
