<script setup lang="ts">
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-vue-next'
import type { Todo } from '~/types/todo'

defineProps<{
  open: boolean
  todo: Todo | null
  submitting: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()
</script>

<template>
  <div
    v-if="open && todo"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
  >
    <div class="w-full max-w-md rounded-xl bg-white shadow-xl">
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div class="flex items-center gap-2 text-red-600">
          <AlertTriangle class="h-5 w-5" />
          <h2 class="text-lg font-semibold">
            Delete Todo
          </h2>
        </div>
        <button
          type="button"
          class="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close modal"
          @click="emit('close')"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <div class="space-y-4 px-6 py-5">
        <p class="text-sm text-gray-600">
          Are you sure you want to delete
          <span class="font-medium text-gray-900">&quot;{{ todo.title }}&quot;</span>?
          This action cannot be undone.
        </p>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            :disabled="submitting"
            @click="emit('close')"
          >
            <X class="h-4 w-4" />
            Cancel
          </button>
          <button
            type="button"
            :disabled="submitting"
            class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            @click="emit('confirm')"
          >
            <Loader2
              v-if="submitting"
              class="h-4 w-4 animate-spin"
            />
            <Trash2
              v-else
              class="h-4 w-4"
            />
            {{ submitting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
