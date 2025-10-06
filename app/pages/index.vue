<script setup lang="ts">
import * as echarts from 'echarts'
import type { GeoJSON } from 'echarts/types/src/coord/geo/geoTypes.js'
import nicJson from '@/assets/nic.geo.json'
import type { ECBasicOption } from 'echarts/types/dist/shared'
import { SimalsiRoles } from '~/constants/roles';

echarts.registerMap('Nicaragua', nicJson as GeoJSON, {})

const optionPie = ref<ECBasicOption | undefined>(undefined)

const optionsBar = ref<ECBasicOption | undefined>(undefined)

const optionMap = ref<ECBasicOption | undefined>(undefined)

const totales = reactive({
  totalClientes: 0,
  totalFacturas: 0,
  totalServicios: 0,
  totalSolicitudes: 0
})

onMounted(() => {
  $fetch<HomeData>('/api/home/data', {
    headers: useRequestHeaders(['cookie']),
  }).then(data => {

    totales.totalClientes = data?.count.totalClientes || 0;
    totales.totalFacturas = data?.count.totalFacturas || 0;
    totales.totalServicios = data?.count.totalServicios || 0;
    totales.totalSolicitudes = data?.count.totalSolicitudes || 0;

    optionsBar.value = {
      title: {
        text: "Cantidad de solicitudes en los últimos 12 meses",
        left: "center",
      },
      xAxis: {
        type: 'category',
        data: data.count.solicitudCount.map(item => `${item.month}/${item.year}`)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data.count.solicitudCount.map(item => item.count),
          type: 'bar'
        }
      ]
    }

    optionMap.value = {
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
        roam: false,
        zoom: 13,
        center: [-85, 13],
        layoutCenter: ["50%", "50%"],
        layoutSize: "100%",
      },
      visualMap: {
        min: 0,
        max: 5,
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
            { name: "Managua", value: 0 },
            { name: "León", value: 0 },
            { name: "Chinandega", value: 0 },
            { name: "Madriz", value: 0 },
            { name: "Masaya", value: 0 },
            { name: "Carazo", value: 0 },
            { name: "Granada", value: 0 },
            { name: "Rivas", value: 0 },
            { name: "Nueva Segovia", value: 0 },
            { name: "Estelí", value: 0 },
            { name: "Jinotega", value: 0 },
            { name: "Matagalpa", value: 0 },
            { name: "Boaco", value: 0 },
            { name: "Chontales", value: 0 },
            { name: "Río San Juan", value: 0 },
            { name: "Región Autónoma de la Costa Caribe Sur", value: 0 },
            { name: "Región Autónoma de la Costa Caribe Norte", value: 0 },
          ].map(item => {
              const de = data.count.departamentoClinica.find(d => d.departamento == item.name)
              console.log(de)

              if (de) {
                return {
                  name: de.departamento,
                  value: de.count
                }
              }
              return {
                name: item.name,
                value: item.value
              }
            }),
        },
      ],
    }

    optionPie.value = {
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
          data: data.count.servicioRank.map(item => ({
            name: item.servicio,
            value: item.cantidad
          }))
        }
      ]
    }
  })
})
</script>

<template>
  <AuthState>
    <template #default="{ user }">
      <div class="flex flex-wrap mx-8 my-4 gap-4">
        <div v-if="!user?.roles?.includes(SimalsiRoles.ROLE_CLIENTE)" class="flex-1 bg-gradient-to-r from-violet-600 to-indigo-400 rounded-lg min-w-32 shadow-xl h-32 p-5">
            <span class="text-white text-xl font-semibold">Total de clientes</span>
            <div class="text-white text-4xl font-bold">
              {{ totales.totalClientes }}
            </div>
        </div>
        <div class="flex-1 bg-gradient-to-r from-blue-600 to-sky-400 rounded-lg min-w-32 shadow-xl h-32 p-5">
            <span class="text-white text-xl font-semibold">Total de facturas</span>
            <div class="text-white text-4xl font-bold">
              {{ totales.totalFacturas }}
            </div>
        </div>
        <div class="flex-1 bg-gradient-to-r from-emerald-600 to-green-400 rounded-lg min-w-32 shadow-xl h-32 p-5">
            <span class="text-white text-xl font-semibold">Total de solicitudes</span>
            <div class="text-white text-4xl font-bold">
              {{ totales.totalSolicitudes }}
            </div>
        </div>
        <div v-if="!user?.roles?.includes(SimalsiRoles.ROLE_CLIENTE)" class="flex-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg min-w-32 shadow-xl h-32 p-5">
            <span class="text-white text-xl font-semibold">Total de servicios</span>
            <div class="text-white text-4xl font-bold">
              {{ totales.totalServicios }}
            </div>
        </div>
      </div>
      <div class="flex flex-wrap mx-8 mb-10 gap-4">
        <div v-if="!pending" class="grow shrink-0 bg-white/70 rounded-lg border w-[45%] min-w-96">
          <v-chart class="chart" :option="optionPie" autoresize />
        </div>
        <div v-if="!user?.roles?.includes(SimalsiRoles.ROLE_CLIENTE)" class="grow shrink-0 bg-white/70 rounded-lg border w-[45%] min-w-96">
          <v-chart class="chart" :option="optionMap" autoresize />
        </div>
        <div v-if="!pending" class="grow shrink-0 bg-white/70 rounded-lg border w-[45%] min-w-96">
          <v-chart class="chart" :option="optionsBar" autoresize />
        </div>
      </div>
    </template>
    <template #placeholder>
      <button class="text-sm font-semibold hover:text-blue-500" disabled>
        <span class="animate-pulse">Cargando...</span>
      </button>
    </template>
  </AuthState>
</template>

<style scoped>
.chart {
    width: 100%;
    height: 400px;
}
</style>
