<template>
  <span>{{ displayValue }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: any;
  params: any;
}>();

const displayValue = computed(() => {
  if (props.params?.fn && typeof props.params.fn === 'function') {
    return props.params.fn(props.value);
  }
  return props.value;
});
</script> 