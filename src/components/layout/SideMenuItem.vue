<script>
import { computed, defineComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ChevronDown, resolveIcon } from '../../utils/icons'

export default defineComponent({
  name: 'SideMenuItem',
  components: { RouterLink, ChevronDown },
  props: {
    item: { type: Object, required: true },
    depth: { type: Number, default: 0 },
  },
  emits: ['toggle'],
  setup(props, { emit }) {
    const route = useRoute()
    const Icon = computed(() => resolveIcon(props.item.icon))
    const hasChildren = computed(
      () => Array.isArray(props.item.subMenu) && props.item.subMenu.length > 0,
    )

    const isActive = computed(() => {
      if (props.item.to && route.path === props.item.to) return true
      if (hasChildren.value) {
        return props.item.subMenu.some(
          (child) =>
            (child.to && route.path === child.to) ||
            child.subMenu?.some((c) => c.to === route.path),
        )
      }
      return false
    })

    function onClick(e) {
      if (hasChildren.value) {
        e.preventDefault()
        emit('toggle', props.item)
      }
    }

    return { Icon, hasChildren, isActive, onClick }
  },
})
</script>

<template>
  <li v-if="item.divider" class="side-nav__devider my-6" />
  <li v-else>
    <RouterLink
      v-if="item.to && !hasChildren"
      :to="item.to"
      class="side-menu"
      :class="{ 'side-menu--active': isActive }"
    >
      <div class="side-menu__icon">
        <component :is="Icon" />
      </div>
      <div class="side-menu__title">{{ item.title }}</div>
    </RouterLink>

    <a
      v-else
      href="javascript:;"
      class="side-menu"
      :class="{
        'side-menu--active': isActive && !item.open,
        'side-menu--open': item.open,
      }"
      @click="onClick"
    >
      <div class="side-menu__icon">
        <component :is="Icon" />
      </div>
      <div class="side-menu__title">
        {{ item.title }}
        <ChevronDown v-if="hasChildren" class="side-menu__sub-icon" />
      </div>
    </a>

    <ul v-if="hasChildren && item.open" class="py-1">
      <SideMenuItem
        v-for="(child, index) in item.subMenu"
        :key="child.title + index"
        :item="child"
        :depth="depth + 1"
        @toggle="$emit('toggle', $event)"
      />
    </ul>
  </li>
</template>
