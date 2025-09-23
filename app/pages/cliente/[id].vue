
<script setup lang="ts">
const route = useRoute()

const id = computed(() => route.params?.id as string)
</script>

<template>
  <ClienteForm :edit="true" />

  <div class="font-semibold text-xl text-stone-700 pt-8 px-10">
      <span>Facturas</span>
  </div>
  <div class="bg-white rounded border shadow-lg p-6 m-6">
    <FacturaTable default-criteria="clienteId" :criteria-value="id"></FacturaTable>
  </div>
</template>
