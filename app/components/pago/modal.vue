<script setup lang="ts">
const props = defineProps<{
    open: boolean,
    facturaId: number
}>()

const model = defineModel()

const pago = ref({
    observaciones: '',
    referencia: '',
    metodoPagoId: null,
    monedaId: null,
    monto: 0
})

const errors = ref({
    observaciones: '',
    referencia: '',
    metodoPagoId: '',
    monedaId: '',
    monto: ''
})

const sweetAlert = useSweetAlert()
const monedas = ref<any[]>([])
const metodoPago = ref<any[]>([])

const moneda = computed(() => {
    const val = monedas.value.find(item => item.value == pago.value.monedaId)

    if (val) {
        return val
    }

    return { signoMonetario: '', tipoCambio: 0 }
})

const conversion = computed(() => {
    if (moneda.value && pago.value.monto) {
        return moneda.value.tipoCambio * pago.value.monto
    }

    return 0;
})

onMounted(async () => {
  $fetch('/api/moneda', {
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    if (Array.isArray(response)) {
      monedas.value = response.map(item => ({
          title: item.descripcion,
          value: item.id,
          signoMonetario: item.signoMonetario,
          tipoCambio: item.tipoCambio
      }))
    }
  })

  $fetch('/api/metodo', {
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    if (Array.isArray(response)) {
      metodoPago.value = response.map(item => ({ title: item.descripcion, value: item.id }))
    }
  })
})

const emit = defineEmits(['toggle','update:modelValue'])

// Guardar selección y cerrar modal
function handleGuardar() {
  $fetch(`/api/factura/${props.facturaId}/pago`, {
    method: 'POST',
    body: pago.value,
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    model.value = response
    pago.value = {
        observaciones: '',
        referencia: '',
        metodoPagoId: null,
        monedaId: null,
        monto: 0
    }
    sweetAlert.successAlert('Pago registrado', 'El pago ha sido registrado correctamente')
          .then(() => emit('toggle'))
  }).catch(error => {
    console.log(error.data)
    if (!error.data.data.errors && error.data.data.error) {
      sweetAlert.errorAlert(error.data.data.error)
    } else {
      errors.value = error.data.data.errors
    }
  })
}
</script>

<template>
    <teleport to="body">
        <div v-show="open" class="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
            <div class="bg-white border mx-auto max-w-5xl rounded-lg p-6 my-20">
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-2xl font-semibold">Información de pago</h1>
                </div>

                <div class="text-base text-neutral-600 mb-4">Información de pago a realizar</div>

                <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                    <v-select label="Moneda" :items="monedas" v-model="pago.monedaId" variant="outlined" density="compact" :error-messages="errors.monedaId"></v-select>

                    <money-field label="Monto" variant="outlined" v-model="pago.monto" :signo-monetario="moneda.signoMonetario" density="compact" :error-messages="errors.monto"></money-field>

                    <money-field label="Tipo de cambio" v-model:model-value="moneda.tipoCambio" variant="outlined" density="compact" :disabled="true"></money-field>

                    <money-field label="Conversión" variant="outlined" v-model:model-value="conversion" density="compact" :disabled="true"></money-field>

                    <v-select class="col-span-2" label="Metodo de pago" v-model="pago.metodoPagoId" :items="metodoPago" variant="outlined" density="compact" :error-messages="errors.metodoPagoId"></v-select>

                    <v-textarea class="col-span-2" label="Observaciones" variant="outlined" density="compact"></v-textarea>
                </div>

                <div class="flex justify-between mt-2">
                    <button
                        @click="$emit('toggle')"
                        class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2">
                        Cancelar
                    </button>
                    <button
                        @click="handleGuardar"
                        class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2">
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    </teleport>
</template>
