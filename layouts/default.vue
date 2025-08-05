<template>
  <div class="min-h-screen bg-white font-gulim" style="width: 100vw; margin: 0; padding: 0;">
    <!-- Top Header -->
    <Header />

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-auto" style="width: 100vw; height: calc(100vh - 60px); margin: 0;">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Header from '~/layouts/Header.vue'
</script>

<style scoped>
/* Custom styles can be added here */
</style> 