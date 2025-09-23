<script setup lang="ts">
import { SimalsiRoles } from '~/constants/roles'

const props = defineProps({
  register: {
    type: Boolean,
    default: false
  },
  selector: {
    type: Boolean,
    default: false
  },
  defaultCriteria: String,
  criteriaValue: String
})

defineEmits(['select'])

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
  { title: 'ID de procedimiento', value: 'id' },
  { title: 'Descripción', value: 'descripcion' },
]

const { data } = await useLazyFetch<Page<any>>('/api/procedimiento/page', {
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
        <router-link
          v-if="user?.roles?.includes(SimalsiRoles.ROLE_ADMIN)"
          to="/procedimiento/store"
          class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2 mb-4"
        >Registrar procedimiento</router-link>
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
          <th class="px-6 py-3">ID</th>
          <th class="px-6 py-3">Descripción</th>
          <th class="px-6 py-3">Región anátomica</th>
          <th class="px-6 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody class="bg-white">
        <tr v-for="item in data?.data" :key="item.id" class="border-b hover:bg-gray-50">
          <td class="border px-6 py-3">
            {{ item.id }}
          </td>
          <td class="border px-6 py-3">
            {{ item.descripcion }}
          </td>
          <td class="border px-6 py-3">
            {{ item.regionAnatomica?.descripcion }}
          </td>
          <td v-if="selector" class="border px-2 py-2">
            <button
              @click="$emit('select', item)"
              class="font-semibold text-sm text-white bg-green-500 rounded-md hover:shadow-lg px-3 py-2"
            >Seleccionar</button>
          </td>
          <td v-else class="border px-6 py-3">
            <NuxtLink
              :to="'/procedimiento/' + item.id"
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
