<script setup lang="ts">
import * as echarts from 'echarts'
import type { GeoJSON } from 'echarts/types/src/coord/geo/geoTypes.js'
import nicJson from '@/assets/nic.geo.json'

echarts.registerMap('Nicaragua', nicJson as GeoJSON, {})

const optionPie = ref({
  title: {
    text: "Servicios con mayor número de solicitudes",
    left: "center",
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    bottom: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Servicio',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10
      },
      label: {
        show: false,
        position: 'center'
      },
      labelLine: {
        show: true
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
})

const optionsBar = ref({
  title: {
    text: "Cantidad de solicitudes en los últimos 12 meses",
    left: "center",
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'bar'
    }
  ]
})

const optionMap = {
  title: {
    text: "Total de clínicas afiliadas por departamento",
    left: "center",
  },
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c}"
  },
  geo: {
    map: "Nicaragua",
    roam: false, // Enable zoom & pan
    zoom: 13, // Default zoom level
    center: [-85, 13], // Approximate center of Nicaragua (Longitude, Latitude)
    layoutCenter: ["50%", "50%"], // Ensures it stays centered
    layoutSize: "100%", // Scale to fit container
  },
  visualMap: {
    min: 0,
    max: 100,
    left: "left",
    top: "bottom",
    text: ["High", "Low"],
    inRange: {
      color: ['#a32a30', '#c96653', '#e8a786', '#9cc2da', '#5891bf', '#3564a7']
    }
  },
  series: [
    {
      type: "map",
      map: "Nicaragua",
      geoIndex: 0,
      emphasis: {
        label: { show: true },
      },
      data: [
        { name: "Managua", value: 100 },
        { name: "León", value: 90 },
        { name: "Chinandega", value: 70 },
        { name: "Madriz", value: 50 },
        { name: "Masaya", value: 95 },
        { name: "Carazo", value: 100 },
        { name: "Granada", value: 80 },
        { name: "Rivas", value: 60 },
        { name: "Nueva Segovia", value: 40 },
        { name: "Estelí", value: 50 },
        { name: "Jinotega", value: 40 },
        { name: "Matagalpa", value: 90 },
        { name: "Boaco", value: 50 },
        { name: "Chontales", value: 30 },
        { name: "Río San Juan", value: 10 },
        { name: "Región Autónoma de la Costa Caribe Sur", value: 10 },
        { name: "Región Autónoma de la Costa Caribe Norte", value: 0 },
      ],
    },
  ],
}

useFetch<any[]>('/api/home/data', {
  headers: useRequestHeaders(['cookie']),
  onResponse: ({ response }) => {
    const data = response._data;
    optionsBar.value.xAxis.data = data.map(item => `${item.month}/${item.year}`)
    optionsBar.value.series[0].data = data.map(item => item.count)
  }
})
</script>

<template>
  <div class="flex flex-wrap mx-8 my-4 gap-4">
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
  <div class="flex flex-wrap mx-8 mb-10 gap-4">
    <div class="grow shrink-0 bg-white/70 rounded-lg border w-[45%] min-w-96">
      <v-chart class="chart" :option="optionPie" autoresize />
    </div>
    <div class="grow shrink-0 bg-white/70 rounded-lg border w-[45%] min-w-96">
      <v-chart class="chart" :option="optionMap" autoresize />
    </div>
    <div class="grow shrink-0 bg-white/70 rounded-lg border w-[45%] min-w-96">
      <v-chart class="chart" :option="optionsBar" autoresize />
    </div>
  </div>
</template>

<style scoped>
.chart {
    width: 100%;
    height: 400px;
}
</style>
