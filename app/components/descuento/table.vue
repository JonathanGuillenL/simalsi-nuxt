<script setup lang="ts">
import { SimalsiRoles } from '~/constants/roles';

defineProps<{
  register?: boolean,
  selector?: boolean,
  seleccionadas?: DescuentoPageResponse[],
}>()

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
  { title: 'ID de descuento', value: 'id' },
  { title: 'Descripción', value: 'descripcion' },
  { title: 'Estado', value: 'estado' },
]

const { data } = await useLazyFetch<Page<DescuentoPageResponse>>('/api/descuento/page', {
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
    <AuthState>
      <template #default="{ user }">
        <NuxtLink
          v-if="register && user?.roles?.includes(SimalsiRoles.ROLE_ADMIN)"
          to="/descuento/store"
          class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2 mb-4"
        >Registrar descuento</NuxtLink>
        <div v-else></div>
      </template>
      <template #placeholder>
        <button class="text-sm font-semibold hover:text-blue-500" disabled>
          <span class="animate-pulse">Cargando...</span>
        </button>
      </template>
    </AuthState>

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
          <th v-if="seleccionadas" class="px-6 py-3">Seleccionar</th>
          <th class="px-6 py-3">ID</th>
          <th class="px-6 py-3">Descripción</th>
          <th class="px-6 py-3 w-1/6">Porcentaje</th>
          <th class="px-6 py-3">Periodo</th>
          <th class="px-6 py-3">Anual</th>
          <th class="px-6 py-3">Estado</th>
          <th class="px-6 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody class="bg-white">
        <tr v-for="item in data?.data" :key="item.id" class="border-b hover:bg-gray-50">
          <td v-if="seleccionadas" class="border px-2 py-2 text-center">
            <input type="checkbox" :value="item.id" @change="$emit('select', item)"
                :checked="seleccionadas.some(s => s.id === item.id)">
          </td>
          <td class="border px-6 py-3">
            {{ item.id }}
          </td>
          <td class="border px-6 py-3">
            {{ item.descripcion }}
          </td>
          <td class="border px-6 py-3">
            {{ item.porcentaje.toFixed(2) }} %
          </td>
          <td class="border px-6 py-3">
            {{ (new Date(item.fechaInicio)).toLocaleDateString('es-NI') + ' - ' + (new Date(item.fechaFin)).toLocaleDateString('es-NI') }}
          </td>
          <td class="border px-6 py-3">
            {{ item.anual ? 'Sí' : 'No' }}
          </td>
          <td class="border px-6 py-3">
            <span v-if="item.deletedAt" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
            <span v-else class="text-xs bg-lime-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Activo</span>
          </td>
          <td class="border px-6 py-3">
            <NuxtLink
              :to="'/descuento/' + item.id"
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
