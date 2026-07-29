<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { PRESET_COLORS, PRESET_BACKGROUNDS } from '@/constants/theme'

const themeStore = useThemeStore()

const panelOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const customBgInput = ref('')

function togglePanel(): void {
  panelOpen.value = !panelOpen.value
}

function closePanel(): void {
  panelOpen.value = false
}

function selectColor(color: string): void {
  themeStore.setPrimaryColor(color)
}

function selectBg(url: string): void {
  themeStore.setBgImage(url)
}

function applyCustomBg(): void {
  const url = customBgInput.value.trim()
  if (!url) return
  themeStore.setCustomBgImage(url)
  customBgInput.value = ''
}

function onDocumentClick(event: MouseEvent): void {
  if (!panelOpen.value) return
  if (event.target instanceof Node && rootRef.value?.contains(event.target)) return
  closePanel()
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div ref="rootRef" class="theme-settings">
    <button
      type="button"
      class="theme-settings__trigger"
      title="Tuỳ chỉnh giao diện"
      aria-label="Tuỳ chỉnh giao diện"
      :aria-expanded="panelOpen"
      @click.stop="togglePanel"
    >
      <i class="pi pi-palette" />
    </button>

    <Transition name="theme-panel">
      <div v-if="panelOpen" class="theme-settings__panel" role="dialog" aria-label="Tuỳ chỉnh giao diện">
        <div class="theme-settings__section">
          <p class="theme-settings__label">Chế độ hiển thị</p>
          <div class="theme-settings__mode-toggle">
            <button
              type="button"
              class="theme-settings__mode-btn"
              :class="{ 'is-active': !themeStore.isDark }"
              @click="themeStore.setMode('light')"
            >
              <i class="pi pi-sun" />
              <span>Sáng</span>
            </button>
            <button
              type="button"
              class="theme-settings__mode-btn"
              :class="{ 'is-active': themeStore.isDark }"
              @click="themeStore.setMode('dark')"
            >
              <i class="pi pi-moon" />
              <span>Tối</span>
            </button>
          </div>
        </div>

        <div class="theme-settings__divider" />

        <div class="theme-settings__section">
          <p class="theme-settings__label">Màu chủ đạo</p>
          <div class="theme-settings__colors">
            <button
              v-for="color in PRESET_COLORS"
              :key="color"
              type="button"
              class="theme-settings__color-swatch"
              :class="{ 'is-active': themeStore.primaryColor === color }"
              :style="{ background: color }"
              :title="color"
              @click="selectColor(color)"
            >
              <i v-if="themeStore.primaryColor === color" class="pi pi-check" />
            </button>
          </div>
          <div class="theme-settings__custom-color">
            <label class="theme-settings__custom-label">Màu tự chọn</label>
            <input
              type="color"
              class="theme-settings__color-input"
              :value="themeStore.primaryColor"
              @input="selectColor(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <div class="theme-settings__divider" />

        <div class="theme-settings__section">
          <p class="theme-settings__label">Ảnh nền sự kiện</p>
          <div class="theme-settings__backgrounds">
            <button
              v-for="bg in PRESET_BACKGROUNDS"
              :key="bg.id"
              type="button"
              class="theme-settings__bg-item"
              :class="{ 'is-active': (bg.url || '') === (themeStore.bgImageUrl || '') }"
              :title="bg.label"
              @click="selectBg(bg.url)"
            >
              <div
                v-if="bg.thumbnail"
                class="theme-settings__bg-thumb"
                :style="{ backgroundImage: `url(${bg.thumbnail})` }"
              />
              <div v-else class="theme-settings__bg-thumb theme-settings__bg-thumb--none">
                <i class="pi pi-ban" />
              </div>
              <span class="theme-settings__bg-name">{{ bg.label }}</span>
            </button>
          </div>
          <div class="theme-settings__custom-bg">
            <input
              v-model="customBgInput"
              type="text"
              class="theme-settings__url-input"
              placeholder="Dán URL ảnh nền tự chọn..."
              @keydown.enter="applyCustomBg"
            />
            <button
              type="button"
              class="theme-settings__url-btn"
              :disabled="!customBgInput.trim()"
              @click="applyCustomBg"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.theme-settings {
  position: relative;
}

.theme-settings__trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  font-size: 1rem;
}

.theme-settings__trigger:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.35);
}

.theme-settings__panel {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  z-index: 50;
  width: min(22rem, calc(100vw - 2rem));
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.theme-settings__section {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.theme-settings__label {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.theme-settings__colors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.theme-settings__color-swatch {
  width: 2rem;
  height: 2rem;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.75rem;
  transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.theme-settings__color-swatch:hover {
  transform: scale(1.1);
}

.theme-settings__color-swatch.is-active {
  border-color: #1e293b;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px currentColor;
}

.theme-settings__custom-color {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-settings__custom-label {
  font-size: 0.75rem;
  color: #64748b;
}

.theme-settings__color-input {
  width: 2rem;
  height: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
  background: none;
}

.theme-settings__color-input::-webkit-color-swatch-wrapper {
  padding: 2px;
}

.theme-settings__color-input::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.theme-settings__divider {
  height: 1px;
  margin: 0.875rem 0;
  background: #f1f5f9;
}

.theme-settings__backgrounds {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.theme-settings__bg-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 10px;
  background: none;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
  overflow: hidden;
}

.theme-settings__bg-item:hover {
  transform: scale(1.03);
}

.theme-settings__bg-item.is-active {
  border-color: var(--app-primary, #472f92);
}

.theme-settings__bg-thumb {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-color: #f1f5f9;
}

.theme-settings__bg-thumb--none {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 1.25rem;
}

.theme-settings__bg-name {
  font-size: 0.6875rem;
  font-weight: 500;
  color: #475569;
  padding-bottom: 0.25rem;
}

.theme-settings__custom-bg {
  display: flex;
  gap: 0.375rem;
  margin-top: 0.25rem;
}

.theme-settings__url-input {
  flex: 1;
  min-width: 0;
  padding: 0.5rem 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.75rem;
  color: #1e293b;
  outline: none;
  transition: border-color 0.15s;
}

.theme-settings__url-input:focus {
  border-color: var(--app-primary, #472f92);
}

.theme-settings__url-input::placeholder {
  color: #94a3b8;
}

.theme-settings__url-btn {
  flex-shrink: 0;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: var(--app-primary, #472f92);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.theme-settings__url-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.theme-settings__url-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.theme-settings__mode-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.theme-settings__mode-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.theme-settings__mode-btn:hover:not(.is-active) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.theme-settings__mode-btn.is-active {
  background: var(--app-primary-light, rgba(71, 47, 146, 0.08));
  border-color: var(--app-primary, #472f92);
  color: var(--app-primary, #472f92);
}

.theme-settings__mode-btn i {
  font-size: 1rem;
}

.theme-panel-enter-active,
.theme-panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.theme-panel-enter-from,
.theme-panel-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}


</style>

<style>
html.dark-mode .theme-settings__panel {
  background: #1e293b !important;
  border-color: #334155 !important;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.3) !important;
}

html.dark-mode .theme-settings__label {
  color: #94a3b8 !important;
}

html.dark-mode .theme-settings__divider {
  background: #334155 !important;
}

html.dark-mode .theme-settings__color-swatch.is-active {
  border-color: #e2e8f0 !important;
  box-shadow: 0 0 0 2px #1e293b, 0 0 0 4px currentColor !important;
}

html.dark-mode .theme-settings__custom-label {
  color: #94a3b8 !important;
}

html.dark-mode .theme-settings__color-input {
  border-color: #475569 !important;
}

html.dark-mode .theme-settings__mode-btn {
  border-color: #475569 !important;
  background: #0f172a !important;
  color: #94a3b8 !important;
}

html.dark-mode .theme-settings__mode-btn:hover:not(.is-active) {
  background: #334155 !important;
  border-color: #64748b !important;
}

html.dark-mode .theme-settings__mode-btn.is-active {
  background: rgba(var(--app-primary-dark-soft-rgb, 107, 91, 158), 0.15) !important;
  border-color: var(--app-primary-dark-soft, #6b5b9e) !important;
  color: var(--app-primary-dark-soft, #6b5b9e) !important;
}

html.dark-mode .theme-settings__bg-thumb {
  background-color: #334155 !important;
}

html.dark-mode .theme-settings__bg-thumb--none {
  color: #64748b !important;
}

html.dark-mode .theme-settings__bg-name {
  color: #94a3b8 !important;
}

html.dark-mode .theme-settings__bg-item.is-active {
  border-color: var(--app-primary-dark-soft, #6b5b9e) !important;
}

html.dark-mode .theme-settings__url-input {
  border-color: #475569 !important;
  background: #0f172a !important;
  color: #e2e8f0 !important;
}

html.dark-mode .theme-settings__url-input::placeholder {
  color: #64748b !important;
}

html.dark-mode .theme-settings__url-input:focus {
  border-color: var(--app-primary-dark-soft, #6b5b9e) !important;
}

html.dark-mode .theme-settings__url-btn {
  background: var(--app-primary-dark-soft, #6b5b9e) !important;
}
</style>
