<script setup lang="ts">
const open = ref(true)

function toggleSidebar() {
  open.value = !open.value
}
</script>

<template>
  <AppHeader :open="open" username="user" @toggle="toggleSidebar" />
  <AppBar :open="open" />
  <main :class="{ 'sm:pl-64': open }" class="pt-16">
    <slot />
  </main>
</template>

<style lang="postcss">
body {
  @apply bg-gray-100;
}
</style>
