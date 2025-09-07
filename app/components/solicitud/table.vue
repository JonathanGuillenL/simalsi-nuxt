<script setup lang="ts">
const props = defineProps({
    register: {
        type: Boolean,
        default: false
    },
    historial: {
        type: Boolean,
        default: false
    },
    defaultCriteria: String,
    criteriaValue: String
})

const route = useRoute()
const router = useRouter()

const queryParams = computed(() => {
  const q: Record<string, any> = { ...route.query }

  q.page = parseInt(route.query.page?.toString() ?? '1') - 1,
  q.size = parseInt(route.query.size?.toString() ?? '5')
  if (props.defaultCriteria && props.criteriaValue) {
    q[props.defaultCriteria] = props.criteriaValue
  }
  return q
})

const criterioItems = [
  { title: 'ID de solicitud', value: 'id' },
  { title: 'Nombre de paciente', value: 'pacienteNombre' },
  { title: 'Nombre de médico tratante', value: 'medicoNombre' },
  { title: 'Procedimiento quirúrgico', value: 'procedimiento' },
  { title: 'Fecha', value: 'fecha' },
]

const { data, pending } = await useLazyFetch<Page<SolicitudPageResponse>>('/api/solicitud/page', {
  headers: useRequestHeaders(['cookie']),
  query: queryParams,
})

function updateQueryParams(page: number, search: boolean = false, filter: Record<string, any> | null = null) {
  console.log(filter)
  if (filter && filter.fechaInicio && filter.fechaFin) {
    router.push({
      query: {
        page,
        fechaInicio: filter.fechaInicio.toLocaleDateString('en-CA'),
        fechaFin: filter.fechaFin.toLocaleDateString('en-CA')
      }
    })
  } else if (filter && filter.criteria && filter.criteriaData) {
    router.push({ query: {
      page,
      [filter.criteria]: filter.criteriaData
    } })
  } else if (search) {
    router.push({ query: queryParams.value })
  } else {
    router.push(`?page=${page}&size=${queryParams.value.size}`)
  }
}

async function handlePdfClick(id: number) {
  const url = await $fetch<string>('/api/solicitud/pdf/' + id, {
    method: 'POST',
    headers: useRequestHeaders(['cookie', 'location']),
  })

  if (url) {
    window.open(url)
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between">
    <router-link
      to="/solicitud/store"
      class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2 mb-4"
    >Registrar solicitud</router-link>

    <SearchCriteria
      :items="criterioItems"
      @search="(filter) => updateQueryParams(1, false, filter)"
      @clear="updateQueryParams(1)"
    />
  </div>

  <div class="rounded-lg border overflow-x-auto">
    <table class="text-left w-full">
      <thead class="text-sm bg-gray-100">
        <tr>
          <th class="px-6 py-3">ID</th>
          <th class="px-6 py-3">Fecha de solicitud</th>
          <th class="px-6 py-3">Paciente</th>
          <th class="px-6 py-3">Médico tratante</th>
          <th class="px-6 py-3">Servicio</th>
          <th class="px-6 py-3">Proceso</th>
          <th class="px-6 py-3">Estado</th>
          <th class="px-6 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody v-if="!pending" class="bg-white">
        <tr v-for="item in data?.data" :key="item.id" class="border-b hover:bg-gray-50">
          <td class="border px-6 py-3">
            {{ item.id }}
          </td>
          <td class="border px-6 py-3">
            {{ (new Date(item.fechaSolicitud)).toLocaleString('es-NI')}}
          </td>
          <td class="border px-6 py-3">
            {{ item.paciente }}
          </td>
          <td class="border px-6 py-3">
            {{ item.medicoTratante ?? '-' }}
          </td>
          <td class="border px-6 py-3">
            {{ item.servicio }}
          </td>
          <td class="border px-6 py-3">
            {{ item.solicitudEstado }}
          </td>
          <td class="border px-6 py-3">
            <span v-if="item.deletedAt" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
            <span v-else class="text-xs bg-lime-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Activo</span>
          </td>
          <td class="border px-6 py-3">
            <div class="flex">
              <button
                @click="handlePdfClick(item.id)"
                class="font-semibold text-sm text-white bg-red-400 rounded-md hover:shadow-lg p-2"
              >
                <v-icon class="fa-solid fa-file-pdf"></v-icon>
              </button>
              <NuxtLink
                :to="'/paciente/' + item.id"
                class="font-semibold text-sm text-white bg-green-500 rounded-md hover:shadow-lg px-3 py-2"
              >
                Ver
              </NuxtLink>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <VPagination
    class="mt-5"
    :model-value="queryParams.page + 1"
    :length="data?.totalPages"
    @update:model-value="n => updateQueryParams(n, true)"
  />
</template>
