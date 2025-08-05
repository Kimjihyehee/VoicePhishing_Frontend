<template>
  <div class="select" v-on-click-outside="closeDropdown" :class="{ 'is-select-open': isShowBox }">
    <button class="select-button" @click="toggleList" :disabled="disabledAll">
      <span class="select-button-title">
        <span v-if="selectedIcon" class="icon">{{ selectedIcon }}</span>
        <span>{{ selectedLabel }}</span>
      </span>
      <span class="select-indicator">▼</span>
    </button>
    <div class="dropdown" v-show="isShowBox">
      <ul class="dropdown-list">
        <template v-if="data.length > 0">
          <li
            class="dropdown-item"
            v-for="(option, index) in data"
            :key="index"
            @click="selectItem(option)"
            :class="[
              { 'disabled-option': isDisabled(option[valueKey || 'value']) },
              { 'is-dropdown-item-selected': isActive(option[valueKey || 'value']) }
            ]"
          >
            <button class="dropdown-button">
              <span v-if="option[iconKey || 'icon']" class="icon">{{ option[iconKey || 'icon'] }}</span>
              <span class="dropdown-text">{{ option[labelKey || 'label'] }}</span>
            </button>
            <button class="button button-neutral-ghost button-xs" v-if="useDelete">
              <span class="hidden-text">닫기</span>
              <span class="button-icon">×</span>
            </button>
          </li>
        </template>
        <template v-else>
          <li class="dropdown-item">
            <div class="notification notification-sm notification-info">
              <p class="notification-detail">{{ nodataMsg }}</p>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components"
import type { SelectBoxProps } from "./SelectBoxProps"
import { SelectBoxComposition } from "./SelectBoxComposition"

const props = withDefaults(defineProps<SelectBoxProps>(), {
  data: () => [],
  labelKey: "label",
  valueKey: "value",
  iconKey: "icon",
  selectedItem: undefined,
  disabledList: () => [],
  disabledAll: false,
  useDelete: false,
  nodataMsg: "데이터가 없습니다.",
  isFirstSelectedEvent: true,
  defaultLabel: ""
})

const emit = defineEmits<{
  (e: "select", option: number | string): void
  (e: "click"): void
}>()

function onSelect(value: string | number) {
  emit("select", value)
}

function onSelectBoxClick() {
  emit("click")
}

const {
  isShowBox,
  selectedLabel,
  selectedIcon,
  toggleList,
  selectItem,
  isDisabled,
  isActive,
  closeDropdown
} = SelectBoxComposition(props, onSelect, onSelectBoxClick)
</script>

<style lang="scss" scoped>
@use '@/assets/SelectBox/SelectBox.scss';
</style> 