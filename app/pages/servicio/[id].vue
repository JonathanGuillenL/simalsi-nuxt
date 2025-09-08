<script setup lang="ts">
const route = useRoute()

const id = computed(() => route.params?.id as string)
</script>

<template>
  <ServicioForm :edit="true" />

  <div class="font-semibold text-xl text-stone-700 pt-8 px-10">
      <span>Solicitudes</span>
  </div>
  <div class="bg-white rounded border shadow-lg p-6 m-6">
    <SolicitudTable default-criteria="servicioId" :criteria-value="id"></SolicitudTable>
  </div>
</template>
