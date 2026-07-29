<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  Search,
  Bell,
  User,
  Edit,
  Lock,
  HelpCircle,
  ToggleRight,
  Inbox,
  Users,
  CreditCard,
} from '../../utils/icons'
import Breadcrumb from './Breadcrumb.vue'
import DarkModeToggle from './DarkModeToggle.vue'
import ThemeSettingsPanel from './ThemeSettingsPanel.vue'
import logoEdutalk from '@/assets/logo_edutalk.svg'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)

const avatarLoadFailed = ref(false)

const displayName = computed(() => currentUser.value?.name?.trim() || 'Tài khoản')

const userInitial = computed(() => {
  const name = currentUser.value?.name?.trim()
  return name ? name.charAt(0).toUpperCase() : '?'
})

const avatarUrl = computed(() => currentUser.value?.image?.trim() || '')

const userSubtitle = computed(() => {
  const user = currentUser.value
  if (!user) return ''

  const position = user.userPositions?.find((item) => item.position?.trim())?.position?.trim()
  if (position) return position

  const accountTypeName = user.accountType?.name?.trim()
  if (accountTypeName) return accountTypeName

  return user.email?.trim() || ''
})

defineProps({
  breadcrumbItems: {
    type: Array,
    default: () => [],
  },
})

const openDropdown = ref(null)

function toggle(name) {
  openDropdown.value = openDropdown.value === name ? null : name
}

function onClickOutside(e) {
  if (!e.target.closest('.dropdown')) {
    openDropdown.value = null
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <!-- BEGIN: Top Bar -->
  <div class="layout-header border-b border-theme-24 -mt-10 md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 pt-3 md:pt-0 mb-2">
    <div class="top-bar-boxed flex items-center">
      <!-- BEGIN: Logo -->
      <RouterLink to="/" class="-intro-x hidden md:flex items-center">
        <img alt="Edutalk" class="w-24" :src="logoEdutalk" />
      </RouterLink>
      <!-- END: Logo -->

      <!-- BEGIN: Breadcrumb -->
      <Breadcrumb :items="breadcrumbItems" light />
      <!-- END: Breadcrumb -->

      <!-- BEGIN: Search -->
      <div class="intro-x relative mr-3 sm:mr-6">
        <div class="search hidden sm:block">
          <input
            type="text"
            class="search__input input placeholder-theme-13"
            placeholder="Search..."
          />
          <Search class="search__icon" :size="20" />
        </div>
        <a class="notification notification--light sm:hidden" href="javascript:;">
          <Search class="notification__icon" :size="20" />
        </a>
        <div class="search-result">
          <div class="search-result__content">
            <div class="search-result__content__title">Pages</div>
            <div class="mb-5">
              <RouterLink to="/inbox" class="flex items-center">
                <div class="w-8 h-8 bg-theme-18 text-theme-9 flex items-center justify-center rounded-full">
                  <Inbox class="w-4 h-4" :size="16" />
                </div>
                <div class="ml-3">Mail Settings</div>
              </RouterLink>
              <RouterLink to="/users" class="flex items-center mt-2">
                <div class="w-8 h-8 bg-theme-17 text-theme-11 flex items-center justify-center rounded-full">
                  <Users class="w-4 h-4" :size="16" />
                </div>
                <div class="ml-3">Users & Permissions</div>
              </RouterLink>
              <RouterLink to="/crud/list" class="flex items-center mt-2">
                <div class="w-8 h-8 bg-theme-14 text-theme-10 flex items-center justify-center rounded-full">
                  <CreditCard class="w-4 h-4" :size="16" />
                </div>
                <div class="ml-3">Transactions Report</div>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Search -->

      <!-- BEGIN: Theme Settings -->
      <ThemeSettingsPanel class="intro-x mr-3 sm:mr-4" />
      <!-- END: Theme Settings -->

      <!-- BEGIN: Dark mode -->
      <DarkModeToggle class="mr-3 sm:mr-4" />
      <!-- END: Dark mode -->

      <!-- BEGIN: Notifications -->
      <div
        class="intro-x dropdown relative mr-4 sm:mr-6"
        :class="{ open: openDropdown === 'notify' }"
      >
        <div
          class="dropdown-toggle notification notification--light notification--bullet cursor-pointer"
          @click.stop="toggle('notify')"
        >
          <Bell class="notification__icon" :size="20" />
        </div>
        <div
          class="notification-content dropdown-box mt-8 absolute top-0 right-0 z-10 -mr-10 sm:mr-0"
          :class="{ show: openDropdown === 'notify' }"
        >
          <div class="notification-content__box dropdown-box__content box">
            <div class="notification-content__title">Notifications</div>
            <div
              v-for="(n, i) in [
                { name: 'Denzel Washington', time: '01:10 PM', text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
                { name: 'Robert De Niro', time: '01:10 PM', text: 'Lorem Ipsum has been the industry standard dummy text ever since the 1500s.' },
                { name: 'John Travolta', time: '01:10 PM', text: 'It is a long established fact that a reader will be distracted.' },
              ]"
              :key="i"
              class="cursor-pointer relative flex items-center"
              :class="{ 'mt-5': i > 0 }"
            >
              <div
                class="w-12 h-12 flex-none rounded-full bg-theme-14 text-theme-1 flex items-center justify-center font-medium mr-1 relative"
              >
                {{ n.name.charAt(0) }}
                <div class="w-3 h-3 bg-theme-9 absolute right-0 bottom-0 rounded-full border-2 border-white" />
              </div>
              <div class="ml-2 overflow-hidden">
                <div class="flex items-center">
                  <a href="javascript:;" class="font-medium truncate mr-5">{{ n.name }}</a>
                  <div class="text-xs text-gray-500 ml-auto whitespace-nowrap">{{ n.time }}</div>
                </div>
                <div class="w-full truncate text-gray-600">{{ n.text }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Notifications -->

      <!-- BEGIN: Account Menu -->
      <div class="intro-x dropdown w-8 h-8 relative" :class="{ open: openDropdown === 'account' }">
        <div
          class="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110 bg-theme-14 text-theme-1 flex items-center justify-center cursor-pointer font-medium"
          :title="displayName"
          @click.stop="toggle('account')"
        >
          <img
            v-if="avatarUrl && !avatarLoadFailed"
            :src="avatarUrl"
            :alt="displayName"
            class="w-full h-full object-cover"
            @error="avatarLoadFailed = true"
          />
          <span v-else>{{ userInitial }}</span>
        </div>
        <div class="dropdown-box mt-10 absolute w-56 top-0 right-0 z-20" :class="{ show: openDropdown === 'account' }">
          <div class="dropdown-box__content box bg-theme-38 text-white">
            <div class="p-4 border-b border-theme-40 flex items-center gap-3">
              <div
                class="w-10 h-10 flex-none rounded-full overflow-hidden bg-theme-14 text-theme-1 flex items-center justify-center font-medium"
              >
                <img
                  v-if="avatarUrl && !avatarLoadFailed"
                  :src="avatarUrl"
                  :alt="displayName"
                  class="w-full h-full object-cover"
                  @error="avatarLoadFailed = true"
                />
                <span v-else>{{ userInitial }}</span>
              </div>
              <div class="min-w-0">
                <div class="font-medium truncate">{{ displayName }}</div>
                <div v-if="userSubtitle" class="text-xs text-theme-41 truncate">{{ userSubtitle }}</div>
              </div>
            </div>
            <div class="p-2">
              <RouterLink
                to="/users/profile"
                class="flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md"
              >
                <User class="w-4 h-4 mr-2" :size="16" /> Profile
              </RouterLink>
              <RouterLink
                to="/profile/update"
                class="flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md"
              >
                <Edit class="w-4 h-4 mr-2" :size="16" /> Add Account
              </RouterLink>
              <RouterLink
                to="/profile/password"
                class="flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md"
              >
                <Lock class="w-4 h-4 mr-2" :size="16" /> Reset Password
              </RouterLink>
              <a
                href="javascript:;"
                class="flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md"
              >
                <HelpCircle class="w-4 h-4 mr-2" :size="16" /> Help
              </a>
            </div>
            <div class="p-2 border-t border-theme-40">
              <RouterLink
                to="/login"
                class="flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-1 rounded-md"
              >
                <ToggleRight class="w-4 h-4 mr-2" :size="16" /> Logout
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Account Menu -->
    </div>
  </div>
  <!-- END: Top Bar -->
</template>
