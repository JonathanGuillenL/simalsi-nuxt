<script setup lang="ts">
defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <aside
    :class="{ '-translate-x-64': !open }"
    class="fixed top-0 bottom-0 z-20 bg-zinc-50 w-64 shadow-2xl border-r px-4 pb-20 duration-300 overflow-y-auto"
  >
    <div class="flex justify-center items-center px-4 py-5">
      <NuxtLink to="/" class="text-black text-2xl font-semibold">SIMALSI</NuxtLink>
    </div>
    <nav>
      <ul class="space-y-1">
        <li>
          <NuxtLink
            to="/home"
            class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
            active-class="bg-blue-100 !border-stone-200"
          >
            <VIcon class="mr-2" icon="fa fa-house" size="x-small" />
            <span>Home</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/paciente"
            class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
            active-class="bg-blue-100 !border-stone-200"
          >
            <VIcon class="mr-2" icon="fa fa-hospital-user" size="x-small" />
            <span>Paciente</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>
