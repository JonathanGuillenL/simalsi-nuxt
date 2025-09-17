<script setup lang="ts">
defineProps<{
    open: boolean,
}>()

const model = defineModel<DescuentoPageResponse[]>()

const seleccionadas = ref(model.value ?? [])

const emit = defineEmits(['update:modelValue', 'toggle', 'selected'])
const router = useRouter()

watchEffect(() => {
  if (model.value) {
    seleccionadas.value = [...model.value]
  }
})

function handleSeleccionar(descuento: DescuentoPageResponse) {
  if (seleccionadas.value) {
    const index = seleccionadas.value.findIndex(s => s.id === descuento.id)
    if (index != -1) {
      seleccionadas.value.splice(index, 1)
    } else {
      seleccionadas.value.push(descuento)
    }
  }
}

function toggleHandler() {
  router.push('')
  emit('toggle')
}

function confirmarSeleccion() {
    emit('update:modelValue', Array.from(seleccionadas.value))
    emit('toggle')
}
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div class="bg-white border mx-auto max-w-5xl rounded-lg p-6 my-20">
        <div class="flex justify-between items-center border-b mb-5">
          <div class="font-semibold text-xl">Seleccione una lista de descuentos</div>
          <button @click="toggleHandler" class="flex justify-center items-center hover:bg-gray-100 rounded p-2 m-1">
            <v-icon icon="fa fa-x" size="x-small"></v-icon>
          </button>
        </div>
        <DescuentoTable :register="false" :seleccionadas="seleccionadas" :selector="true" @select="handleSeleccionar" />
        <div class="mt-4 flex justify-end">
          <button @click="confirmarSeleccion" class="bg-green-500 text-white px-4 py-2 rounded hover:shadow-lg">Confirmar</button>
        </div>
      </div>
    </div>
  </teleport>
</template>
