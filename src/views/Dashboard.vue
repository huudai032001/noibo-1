<script setup>
import {
  ShoppingCart,
  CreditCard,
  Monitor,
  User,
  ChevronUp,
  ChevronDown,
  RefreshCcw,
  Calendar,
  ChevronDown as ChevronDownIcon,
} from '../utils/icons'
import BaseChart from '../components/charts/BaseChart.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const filterOpen = ref(false)

function onOutside(e) {
  if (!e.target.closest('.dropdown')) filterOpen.value = false
}
onMounted(() => document.addEventListener('click', onOutside))
onBeforeUnmount(() => document.removeEventListener('click', onOutside))

const reports = [
  {
    icon: ShoppingCart,
    iconClass: 'text-theme-10',
    value: '4.510',
    label: 'Item Sales',
    percent: '33%',
    up: true,
    indicatorClass: 'bg-theme-9',
  },
  {
    icon: CreditCard,
    iconClass: 'text-theme-11',
    value: '3.521',
    label: 'New Orders',
    percent: '2%',
    up: false,
    indicatorClass: 'bg-theme-6',
  },
  {
    icon: Monitor,
    iconClass: 'text-theme-12',
    value: '2.145',
    label: 'Total Products',
    percent: '12%',
    up: true,
    indicatorClass: 'bg-theme-9',
  },
  {
    icon: User,
    iconClass: 'text-theme-9',
    value: '152.000',
    label: 'Unique Visitor',
    percent: '22%',
    up: true,
    indicatorClass: 'bg-theme-9',
  },
]

const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'This Month',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 80, 85, 75, 90],
      borderColor: '#3160D8',
      backgroundColor: 'rgba(49, 96, 216, 0.08)',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Last Month',
      data: [20, 30, 45, 40, 55, 45, 50, 70, 60, 65, 55, 70],
      borderColor: '#D2DFEA',
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0.4,
      fill: false,
    },
  ],
}

const lineOptions = {
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    y: { grid: { color: '#eef2f7' }, ticks: { color: '#94a3b8' }, beginAtZero: true },
  },
}

const pieData = {
  labels: ['17 - 30 Years old', '31 - 50 Years old', '>= 50 Years old'],
  datasets: [
    {
      data: [62, 33, 10],
      backgroundColor: ['#F78B00', '#1C3FAA', '#FBC500'],
      borderWidth: 0,
    },
  ],
}

const pieOptions = {
  plugins: { legend: { display: false } },
}

const donutData = {
  labels: ['17 - 30 Years old', '31 - 50 Years old', '>= 50 Years old'],
  datasets: [
    {
      data: [62, 33, 10],
      backgroundColor: ['#F78B00', '#1C3FAA', '#FBC500'],
      borderWidth: 0,
      cutout: '70%',
    },
  ],
}

const legend = [
  { color: 'bg-theme-11', label: '17 - 30 Years old', value: '62%' },
  { color: 'bg-theme-1', label: '31 - 50 Years old', value: '33%' },
  { color: 'bg-theme-12', label: '>= 50 Years old', value: '10%' },
]

const transactions = [
  { name: 'Arnold Schwarzenegger', date: '12 March 2022', amount: '+$34', positive: false },
  { name: 'Arnold Schwarzenegger', date: '25 August 2022', amount: '+$98', positive: true },
  { name: 'Nicolas Cage', date: '12 January 2022', amount: '+$85', positive: true },
  { name: 'Angelina Jolie', date: '21 September 2022', amount: '+$212', positive: true },
  { name: 'Brad Pitt', date: '18 April 2022', amount: '+$20', positive: true },
]

const activities = [
  { name: 'Johnny Depp', text: 'Has joined the team', time: '07:00 PM' },
  { name: 'Angelina Jolie', text: 'Has joined the team', time: '07:00 PM' },
  { name: 'John Travolta', text: 'Has joined the team', time: '07:00 PM' },
  { name: 'Nicolas Cage', text: 'Has joined the team', time: '07:00 PM' },
  { name: 'Sylvester Stallone', text: 'Has joined the team', time: '07:00 PM' },
]

const today = new Date()
const dateLabel = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()} - ${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 xxl:col-span-9 grid grid-cols-12 gap-6">
      <!-- General Report -->
      <div class="col-span-12 mt-8">
        <div class="intro-y flex items-center h-10">
          <h2 class="text-lg font-medium truncate mr-5">General Report</h2>
          <a href="javascript:;" class="ml-auto flex text-theme-1 items-center">
            <RefreshCcw class="w-4 h-4 mr-3" /> Reload Data
          </a>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-5">
          <div
            v-for="(card, i) in reports"
            :key="i"
            class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
          >
            <div class="report-box zoom-in">
              <div class="box p-5">
                <div class="flex">
                  <component :is="card.icon" class="report-box__icon" :class="card.iconClass" />
                  <div class="ml-auto">
                    <div class="report-box__indicator cursor-pointer" :class="card.indicatorClass">
                      {{ card.percent }}
                      <ChevronUp v-if="card.up" class="w-4 h-4" />
                      <ChevronDown v-else class="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div class="text-3xl font-bold leading-8 mt-6">{{ card.value }}</div>
                <div class="text-base text-gray-600 mt-1">{{ card.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales Report line -->
      <div class="col-span-12 lg:col-span-6 mt-8">
        <div class="intro-y block sm:flex items-center h-10">
          <h2 class="text-lg font-medium truncate mr-5">Sales Report</h2>
          <div class="sm:ml-auto mt-3 sm:mt-0 relative text-gray-700">
            <Calendar class="w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0" />
            <input type="text" class="datepicker input w-full sm:w-56 box pl-10" :value="dateLabel" readonly />
          </div>
        </div>
        <div class="intro-y box p-5 mt-12 sm:mt-5">
          <div class="flex flex-col xl:flex-row xl:items-center">
            <div class="flex">
              <div>
                <div class="text-theme-20 text-lg xl:text-xl font-bold">$15,000</div>
                <div class="text-gray-600">This Month</div>
              </div>
              <div class="w-px h-12 border border-r border-dashed border-gray-300 mx-4 xl:mx-6" />
              <div>
                <div class="text-gray-600 text-lg xl:text-xl font-medium">$10,000</div>
                <div class="text-gray-600">Last Month</div>
              </div>
            </div>
            <div class="dropdown relative xl:ml-auto mt-5 xl:mt-0" :class="{ open: filterOpen }">
              <button
                class="dropdown-toggle button font-normal border relative flex items-center text-gray-700 bg-white"
                @click.stop="filterOpen = !filterOpen"
              >
                Filter by Category
                <ChevronDownIcon class="w-4 h-4 ml-2" />
              </button>
              <div class="dropdown-box mt-10 absolute w-40 top-0 xl:right-0 z-20">
                <div class="dropdown-box__content box p-2 overflow-y-auto h-32">
                  <a
                    v-for="cat in ['PC & Laptop', 'Smartphone', 'Electronic', 'Photography', 'Sport']"
                    :key="cat"
                    href="javascript:;"
                    class="flex items-center p-2 transition duration-300 ease-in-out bg-white hover:bg-gray-200 rounded-md"
                  >
                    {{ cat }}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="report-chart mt-6">
            <BaseChart type="line" :data="lineData" :options="lineOptions" :height="200" />
          </div>
        </div>
      </div>

      <!-- Weekly Top Seller pie -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
        <div class="intro-y flex items-center h-10">
          <h2 class="text-lg font-medium truncate mr-5">Weekly Top Seller</h2>
          <a href="javascript:;" class="ml-auto text-theme-1 truncate">See all</a>
        </div>
        <div class="intro-y box p-5 mt-5">
          <BaseChart type="pie" :data="pieData" :options="pieOptions" :height="220" />
          <div class="mt-8">
            <div
              v-for="(item, i) in legend"
              :key="item.label"
              class="flex items-center"
              :class="{ 'mt-4': i > 0 }"
            >
              <div class="w-2 h-2 rounded-full mr-3" :class="item.color" />
              <span class="truncate">{{ item.label }}</span>
              <div class="h-px flex-1 border border-r border-dashed border-gray-300 mx-3 xl:hidden" />
              <span class="font-medium xl:ml-auto">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales Report donut -->
      <div class="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
        <div class="intro-y flex items-center h-10">
          <h2 class="text-lg font-medium truncate mr-5">Sales Report</h2>
          <a href="javascript:;" class="ml-auto text-theme-1 truncate">See all</a>
        </div>
        <div class="intro-y box p-5 mt-5">
          <BaseChart type="doughnut" :data="donutData" :options="pieOptions" :height="220" />
          <div class="mt-8">
            <div
              v-for="(item, i) in legend"
              :key="'d-' + item.label"
              class="flex items-center"
              :class="{ 'mt-4': i > 0 }"
            >
              <div class="w-2 h-2 rounded-full mr-3" :class="item.color" />
              <span class="truncate">{{ item.label }}</span>
              <div class="h-px flex-1 border border-r border-dashed border-gray-300 mx-3 xl:hidden" />
              <span class="font-medium xl:ml-auto">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right column -->
    <div class="col-span-12 xxl:col-span-3 xxl:border-l border-theme-5 -mb-10 pb-10">
      <div class="xxl:pl-6 grid grid-cols-12 gap-6">
        <!-- Transactions -->
        <div class="col-span-12 md:col-span-6 xl:col-span-4 xxl:col-span-12 mt-3 xxl:mt-8">
          <div class="intro-x flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Transactions</h2>
          </div>
          <div class="mt-5">
            <div v-for="(tx, i) in transactions" :key="i" class="intro-x">
              <div class="box px-5 py-3 mb-3 flex items-center zoom-in">
                <div
                  class="w-10 h-10 flex-none rounded-full overflow-hidden bg-theme-14 text-theme-1 flex items-center justify-center font-medium"
                >
                  {{ tx.name.charAt(0) }}
                </div>
                <div class="ml-4 mr-auto">
                  <div class="font-medium">{{ tx.name }}</div>
                  <div class="text-gray-600 text-xs">{{ tx.date }}</div>
                </div>
                <div :class="tx.positive ? 'text-theme-9' : 'text-theme-6'">{{ tx.amount }}</div>
              </div>
            </div>
            <a
              href="javascript:;"
              class="intro-x w-full block text-center rounded-md py-3 border border-dotted border-theme-15 text-theme-16"
            >
              View More
            </a>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="col-span-12 md:col-span-6 xl:col-span-4 xxl:col-span-12 mt-3">
          <div class="intro-x flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Recent Activities</h2>
            <a href="javascript:;" class="ml-auto text-theme-1 truncate">See all</a>
          </div>
          <div class="mt-5 relative">
            <div class="absolute left-5 top-0 bottom-0 w-px bg-theme-5" />
            <div
              v-for="(act, i) in activities"
              :key="i"
              class="intro-x relative flex items-center mb-5"
            >
              <div
                class="w-10 h-10 flex-none rounded-full overflow-hidden bg-theme-14 text-theme-1 flex items-center justify-center font-medium z-10 border-2 border-white shadow"
              >
                {{ act.name.charAt(0) }}
              </div>
              <div class="box px-5 py-3 ml-4 flex-1 zoom-in">
                <div class="flex items-center">
                  <div class="font-medium">{{ act.name }}</div>
                  <div class="text-xs text-gray-500 ml-auto">{{ act.time }}</div>
                </div>
                <div class="text-gray-600 mt-1">{{ act.text }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
