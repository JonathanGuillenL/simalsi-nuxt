<script setup lang="ts">
defineProps<{
    open: boolean,
    clienteId: number | undefined
}>()

const model = defineModel<SolicitudPageResponse[]>()

const seleccionadas = ref(model.value ?? [])

const emit = defineEmits(['update:modelValue', 'toggle', 'selected'])
const router = useRouter()

watchEffect(() => {
  if (model.value) {
    seleccionadas.value = [...model.value]
  }
})

function handleSeleccionar(solicitud: SolicitudPageResponse) {
  if (seleccionadas.value) {
    const index = seleccionadas.value.findIndex(s => s.id === solicitud.id)
    if (index != -1) {
      seleccionadas.value.splice(index, 1)
    } else {
      seleccionadas.value.push(solicitud)
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
          <div class="font-semibold text-xl">Seleccione las solicitudes</div>
          <button @click="toggleHandler" class="flex justify-center items-center hover:bg-gray-100 rounded p-2 m-1">
            <v-icon icon="fa fa-x" size="x-small"></v-icon>
          </button>
        </div>
        <SolicitudTable v-if="clienteId" :no-facturada="true" :nfcliente-id="clienteId" :seleccionadas="seleccionadas" :selector="true" @select="handleSeleccionar" />
        <div class="mt-4 flex justify-end">
          <button @click="confirmarSeleccion" class="bg-green-500 text-white px-4 py-2 rounded hover:shadow-lg">Confirmar</button>
        </div>
      </div>
    </div>
  </teleport>
</template>
