<script setup lang="ts">

const { data, pending, error } = await useFetch('/api/home/data', { headers: useRequestHeaders(['cookie']) })

const option = ref( {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: data
    }
  ]
})
</script>

<template>
  <div class="flex flex-wrap m-8 gap-8">
    <div class="flex-1 bg-gradient-to-r from-violet-600 to-indigo-400 rounded-lg min-w-32 shadow-xl h-32 p-5">
        <span class="text-white text-lg font-semibold">Total de clientes</span>
    </div>
    <div class="flex-1 bg-gradient-to-r from-blue-600 to-sky-400 rounded-lg min-w-32 shadow-xl h-32 p-5">
        <span class="text-white text-lg font-semibold">Total de facturas</span>
    </div>
    <div class="flex-1 bg-gradient-to-r from-emerald-600 to-green-400 rounded-lg min-w-32 shadow-xl h-32 p-5">
        <span class="text-white text-lg font-semibold">Total de solicitudes</span>
    </div>
    <div class="flex-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg min-w-32 shadow-xl h-32 p-5">
        <span class="text-white text-lg font-semibold">Cantidad de servicios</span>
    </div>
  </div>
  <div class="flex flex-wrap m-8 gap-8">
    <div class="grow shrink-0 bg-white rounded-lg shadow-xl box-border p-5 w-[45%] min-w-96">
      <v-chart class="w-full h-96" :option="option" autoresize />
      {{ data }}
    </div>
  </div>
</template>
