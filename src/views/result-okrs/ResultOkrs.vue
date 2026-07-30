<script setup lang="ts">
import ResultOkrsHero from './components/ResultOkrsHero.vue'
import ResultOkrsTable from './components/ResultOkrsTable.vue'
import { useResultOkrsPage } from './composables/use-result-okrs-page'

const page = useResultOkrsPage()

const { filters, pagination, items, loading, errorMessage, totalExpLabel, handleResetFilters, handlePageChange } =
  page

const name = filters.name
const quarter = filters.quarter
const year = filters.year
const total = pagination.total
const currentPage = pagination.currentPage
const perPage = pagination.perPage
</script>

<template>
  <div class="grid grid-cols-12 gap-4 py-3 sm:gap-5 sm:py-4">
    <div class="col-span-12">
      <ResultOkrsHero
        :name="name"
        :quarter="quarter"
        :year="year"
        :quarter-options="filters.quarterOptions"
        :loading="loading"
        :total-exp-label="totalExpLabel"
        @update:name="name = $event"
        @update:quarter="quarter = $event"
        @update:year="year = $event"
        @reset="handleResetFilters"
      />
    </div>

    <div
      v-if="errorMessage && !loading"
      class="col-span-12 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
    >
      {{ errorMessage }}
    </div>

    <div class="col-span-12">
      <ResultOkrsTable
        :items="items"
        :loading="loading"
        :total="total"
        :current-page="currentPage"
        :per-page="perPage"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>
