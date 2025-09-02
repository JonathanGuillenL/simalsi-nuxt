<script setup lang="ts">
const route = useRoute()
const router = useRouter()

function getCriteria() {
  const entries = Object.entries(route.query)
  return entries.find(e => e[0] !== 'page')
}

const criteria = ref<string | null>(getCriteria()?.[0] ?? null)
const criteriaValue = ref<string | null>(getCriteria()?.[1]?.toString() ?? null)
const queryParams = computed(() => {
  const q: Record<string, any> = { ...route.query }

  q.page = parseInt(route.query.page?.toString() ?? '1') - 1,
  q.size = 5
  return q
})

const criterioItems = [
  { title: 'ID de paciente', value: 'id' },
  { title: 'Nombre', value: 'nombres' },
  { title: 'Sexo', value: 'sexo' },
  { title: 'Teléfono', value: 'telefono' },
  { title: 'Estado', value: 'estado' },
]

const { data } = await useLazyFetch<Page<PacientePageResponse>>('/api/paciente/page', {
  headers: useRequestHeaders(['cookie']),
  query: queryParams,
})

function updateQueryParams(page: number, search: boolean = false) {
  if (search && criteria.value && criteriaValue.value) {
    router.push(`?page=${page}&${criteria.value}=${criteriaValue.value}`)
  } else {
    router.push(`?page=${page}`)
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between">
    <router-link
      to="/paciente/store"
      class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2 mb-4"
    >Registrar paciente</router-link>

    <SearchCriteria
      v-model:criteria="criteria"
      v-model:criteria-value="criteriaValue"
      :items="criterioItems"
      @search="updateQueryParams(1, true)"
      @clear="updateQueryParams(1)"
    />
  </div>

  <div class="rounded-lg border overflow-x-auto">
    <table class="text-left w-full">
      <thead class="text-sm bg-gray-100">
        <tr>
          <th class="px-6 py-3">ID</th>
          <th class="px-6 py-3">Nombre</th>
          <th class="px-6 py-3">Sexo</th>
          <th class="px-6 py-3">Edad</th>
          <th class="px-6 py-3">Nacimiento</th>
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
            {{ item.sexo }}
          </td>
          <td class="border px-6 py-3">
            {{ item.edad }}
          </td>
          <td class="border px-6 py-3">
            {{ item.nacimiento }}
          </td>
          <td class="border px-6 py-3">
            {{ item.telefono }}
          </td>
          <td class="border px-6 py-3">
            <span v-if="item.deletedAt" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
            <span v-else class="text-xs bg-lime-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Activo</span>
          </td>
          <td class="border px-6 py-3">
            <NuxtLink
              :to="'/paciente/' + item.id"
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
