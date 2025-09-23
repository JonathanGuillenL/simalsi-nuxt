<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  items: CriteriaItem[]
}>()

const emit = defineEmits(['search', 'clear'])
const route = useRoute()

const filters = reactive<Record<string, any>>({
  criterio: null,
  criteriaData: null,
  fechaInicio: route.query.fechaInicio ?? null,
  fechaFin: route.query.fechaFin ?? null
})
const criterioLabel = computed(() => {
  const label = props.items.find(item => item.value == filters.criteria)
  return label?.title
})

const estados: CriteriaItem[] = [
  { title: 'Activo', value: 'ACTIVO' },
  { title: 'Inactivo', value: 'INACTIVO' }
]

const tiposCliente: CriteriaItem[] = [
  { title: 'Cliente espontáneo', value: 'CLIENTE_ESPONTANEO' },
  { title: 'Médico afiliado', value: 'MEDICO_AFILIADO' },
  { title: 'Clínica afiliada', value: 'CLINICA_AFILIADA' }
]

onMounted(() => {
  const [criteria, valor] = getCriteria() ?? []

  if (criteria?.startsWith('fecha')) {
    filters.criteria = 'fecha'
  } else {
    filters.criteria = criteria ?? null
    filters.criteriaData = valor ?? null
  }
})

function getCriteria() {
  const ignore = ['page', 'size']
  const entries = Object.entries(route.query)
  return entries.find(e => !ignore.includes(e[0]))
}

function clearCriteriaHandler() {
  filters.criteria = null
  emit('clear')
}
</script>

<template>
  <div class="flex flex-wrap gap-x-2">
    <VSelect
      v-model="filters.criteria"
      :items="items"
      class="w-60"
      label="Criterio de búsqueda"
      clearable
      variant="solo"
      density="compact"
      @click:clear="clearCriteriaHandler"
      @update:model-value="filters.criteriaData = null"
    />
    <div v-if="filters.criteria">
      <VSelect
        v-if="filters.criteria === 'estado'"
        v-model="filters.criteriaData"
        :label="criterioLabel"
        :items="estados"
        class="w-52"
        variant="outlined"
        density="compact"
      />
      <VSelect
        v-if="filters.criteria === 'tipoCliente'"
        v-model="filters.criteriaData"
        :label="criterioLabel"
        :items="tiposCliente"
        class="w-52"
        variant="outlined"
        density="compact"
      />
      <div v-else-if="filters.criteria == 'fecha'" class="flex space-x-3">
        <VDateInput class="w-52" :label="criterioLabel + ' inicio'" v-model="filters.fechaInicio" prepend-icon="" variant="outlined" density="compact"></VDateInput>
        <VDateInput class="w-52" :label="criterioLabel + ' fin'" v-model="filters.fechaFin" prepend-icon="" variant="outlined" density="compact"></VDateInput>
      </div>
      <VTextField
        v-else
        v-model="filters.criteriaData"
        :label="criterioLabel"
        class="w-52"
        variant="outlined"
        density="compact"
        @keyup.enter="emit('search', { ...filters })"
      />
    </div>
    <button
      class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2 mb-6"
      @click="emit('search', { ...filters })"
    >
      <VIcon icon="fa-solid fa-magnifying-glass" size="small" />
    </button>
  </div>
</template>
