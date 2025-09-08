<script setup lang="ts">
import useWindowSize from '~/composables/useWindowSize';

defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['toggle'])

const { match } = useWindowSize(640)
</script>

<template>
  <div v-if="!match && open" class="fixed inset-0 bg-black/60 z-20" @click="$emit('toggle')"></div>
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

        <div class="text-sm text-black mt-5">Solicitud</div>
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
        <li>
          <NuxtLink
            to="/medico-tratante"
            class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
            active-class="bg-blue-100 !border-stone-200"
          >
            <VIcon class="mr-2" icon="fa fa-user-doctor" size="x-small" />
            <span>Médico tratante</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/solicitud"
            class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
            active-class="bg-blue-100 !border-stone-200"
          >
            <VIcon class="mr-2" icon="fa fa-file-lines" size="x-small" />
            <span>Solicitud</span>
          </NuxtLink>
        </li>

        <div class="text-sm text-black mt-5">Facturación</div>
        <li>
          <NuxtLink
            to="/cliente"
            class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
            active-class="bg-blue-100 !border-stone-200"
          >
            <VIcon class="mr-2" icon="fa fa-file-lines" size="x-small" />
            <span>Cliente</span>
          </NuxtLink>
        </li>

        <div class="text-sm text-black mt-5">Facturación</div>
        <li>
          <NuxtLink
            to="/servicio"
            class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
            active-class="bg-blue-100 !border-stone-200"
          >
            <VIcon class="mr-2" icon="fa fa-flask" size="x-small" />
            <span>Servicio laboratorio</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>
