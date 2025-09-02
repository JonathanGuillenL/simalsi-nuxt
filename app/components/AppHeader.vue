<script setup lang="ts">
defineProps<{
  open: boolean
}>()

defineEmits(['toggle'])

const float = ref(false)
</script>

<template>
  <header
    :class="{ 'sm:ml-64': open }"
    class="fixed top-0 left-0 right-0 z-10 flex items-center justify-between bg-white border-b px-4 h-16 duration-300"
  >
    <button
      class="text-black hover:bg-stone-100 rounded-full p-3"
      @click="$emit('toggle')">
      <VIcon icon="fa fa-bars" size="small" />
    </button>
    <div class="relative">
      <AuthState>
        <template #default="{ user }">
          <button
            class="text-sm font-semibold hover:text-blue-500"
            @click="float = true">
            {{ user?.given_name }}
          </button>
        </template>
        <template #placeholder>
          <button class="text-sm font-semibold hover:text-blue-500" disabled>
            <span class="animate-pulse">Cargando...</span>
          </button>
        </template>
      </AuthState>
      <div v-show="float" class="fixed inset-0 bg-transparent" @click="float = false">
        <div class="absolute right-2 top-[68px] bg-white rounded-lg border shadow-2xl space-y-2 w-32 p-2">
          <a href="" class="block text-sm">Perfil</a>
          <a href="/api/auth/logout" class="block text-sm">Cerrar sesión</a>
        </div>
      </div>
    </div>
  </header>
</template>
