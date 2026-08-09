<template>
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
          <tr
            v-for="n in 10"
            :key="n"
            class="animate-pulse"
          >
            <td class="px-6 py-4">
              <div class="h-4 w-3/4 rounded bg-gray-200" />
            </td>
            <td class="px-6 py-4">
              <div class="h-6 w-20 rounded-full bg-gray-200" />
            </td>
            <td class="px-6 py-4">
              <div class="h-4 w-32 rounded bg-gray-200" />
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-end gap-2">
                <div class="h-7 w-16 rounded-lg bg-gray-200" />
                <div class="h-7 w-14 rounded-lg bg-gray-200" />
                <div class="h-7 w-16 rounded-lg bg-gray-200" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="h-4 w-56 animate-pulse rounded bg-gray-200" />
      <div class="flex items-center gap-2">
        <div class="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
        <div class="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  </div>
</template>
