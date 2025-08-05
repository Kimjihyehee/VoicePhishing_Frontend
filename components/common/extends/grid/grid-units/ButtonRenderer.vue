<template>
  <button 
    :class="buttonClass"
    @click="handleClick"
  >
    {{ buttonText }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: any;
  params: any;
}>();

const buttonText = computed(() => props.params?.buttonText || 'Button');
const buttonClass = computed(() => `btn ${props.params?.buttonTheme || 'btn-primary'}`);

const handleClick = () => {
  if (props.params?.onClickRenderer) {
    props.params.onClickRenderer(props.data);
  }
};
</script>

<style scoped>
.btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style> 