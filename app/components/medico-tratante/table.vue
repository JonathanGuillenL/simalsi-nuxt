<script setup lang="ts">
defineProps({
  register: {
    type: Boolean,
    default: false
  },
  selector: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])

const route = useRoute()
const router = useRouter()

const queryParams = computed(() => {
  const q: Record<string, any> = { ...route.query }

  q.page = parseInt(route.query.page?.toString() ?? '1') - 1,
  q.size = parseInt(route.query.size?.toString() ?? '5')
  return q
})

const criterioItems = [
  { title: 'ID de médico tratante', value: 'id' },
  { title: 'Nombre', value: 'nombres' },
  { title: 'Código sanitario', value: 'codigoSanitario' },
  { title: 'Teléfono', value: 'telefono' },
  { title: 'Estado', value: 'estado' },
]

const { data } = await useLazyFetch<Page<MedicoTratantePageResponse>>('/api/medico-tratante/page', {
  headers: useRequestHeaders(['cookie']),
  query: queryParams,
})

function updateQueryParams(page: number, search: boolean = false, filter: Record<string, any> | null = null) {
  console.log(filter)
  if (filter && filter.criteria && filter.criteriaData) {
    router.push({ query: {
      page,
      [filter.criteria]: filter.criteriaData
    } })
  } else if (search) {
    router.push({ query: { ...queryParams.value, page } })
  } else {
    router.push(`?page=${page}`)
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between">
    <router-link
      to="/medico-tratante/store"
      class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2 mb-4"
    >Registrar médico tratante</router-link>

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
          <th class="px-6 py-3">Nombre</th>
          <th class="px-6 py-3">Código sanitario</th>
          <th class="px-6 py-3">Teléfono</th>
          <th class="px-6 py-3">Estado</th>
          <th class="px-6 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody class="bg-white">
        <tr v-for="item in data?.data" :key="item.id" class="border-b hover:bg-gray-50">
          <td class="border px-6 py-3">
            {{ item.id }}
          </td>
          <td class="border px-6 py-3">
            {{ item.nombre }}
          </td>
          <td class="border px-6 py-3">
            {{ item.codigoSanitario }}
          </td>
          <td class="border px-6 py-3">
            {{ item.telefono }}
          </td>
          <td class="border px-6 py-3">
            <span v-if="item.deletedAt" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
            <span v-else class="text-xs bg-lime-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Activo</span>
          </td>
          <td v-if="selector" class="border px-2 py-2">
            <button
              @click="$emit('select', item)"
              class="font-semibold text-sm text-white bg-green-500 rounded-md hover:shadow-lg px-3 py-2"
            >Seleccionar</button>
          </td>
          <td v-else class="border px-6 py-3">
            <NuxtLink
              :to="'/medico-tratante/' + item.id"
              class="font-semibold text-sm text-white bg-green-500 rounded-md hover:shadow-lg px-3 py-2"
            >
              Ver
            </NuxtLink>
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
