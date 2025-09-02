<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  items: CriteriaItem[]
}>()

const emit = defineEmits(['search', 'clear'])

const criteria = defineModel<string | null>('criteria')
const criteriaData = defineModel<string | null>('criteriaValue')
const criterioLabel = computed(() => {
  const label = props.items.find(item => item.value == criteria.value)
  return label?.title
})

const estados: CriteriaItem[] = [
  { title: 'Activo', value: 'ACTIVO' },
  { title: 'Inactivo', value: 'INACTIVO' }
]

function clearCriteriaHandler() {
  criteria.value = null
  emit('clear')
}
</script>

<template>
  <div class="flex flex-wrap gap-x-2">
    <VSelect
      v-model="criteria"
      :items="items"
      class="w-60"
      label="Criterio de búsqueda"
      clearable
      variant="solo"
      density="compact"
      @click:clear="clearCriteriaHandler"
      @update:model-value="criteriaData = null"
    />
    <div v-if="criteria">
      <VSelect
        v-if="criteria === 'estado'"
        v-model="criteriaData"
        :label="criterioLabel"
        :items="estados"
        class="w-52"
        variant="outlined"
        density="compact"
      />
      <VTextField
        v-else
        v-model="criteriaData"
        :label="criterioLabel"
        class="w-52"
        variant="outlined"
        density="compact"
      />
    </div>
    <button
      class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2 mb-6"
      @click="$emit('search')"
    >
      <VIcon icon="fa-solid fa-magnifying-glass" size="small" />
    </button>
  </div>
</template>
