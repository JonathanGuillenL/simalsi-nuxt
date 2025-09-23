<script setup lang="ts">
const props = defineProps<{
    open: boolean,
    selectedLamina: LaminaCaja | null,
}>()

const model = defineModel<LaminaCaja[]>()

const laminas = ref<LaminaCaja[]>([])

const cajas = ref<any[]>([])
const cajaSeleccionada = ref<CajaResponse | null>(null)
const cajaLaminas = ref<any[]>([])
const sweetAlert = useSweetAlert()

onMounted(async () => {
  $fetch('/api/caja', {
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    if (Array.isArray(response)) {
      cajas.value = response.map(item => ({ title: item.id, value: item }))
    }
  })
})

const emit = defineEmits(['toggle'])

function handleToggleLamina(cajaId: number, fila: number, columna: number) {
  sweetAlert.confirmAlert('¿Estás seguro que deseas reubicar esta lamina?')
    .then((result) => {
      if (result.isConfirmed) {
        $fetch<LaminaCaja>('/api/muestra/mover/' + props.selectedLamina?.id, {
          method: 'POST',
          body: {
            cajaId,
            fila,
            columna
          },
          headers: useRequestHeaders(['cookie']),
        }).then(response => {
          if (model.value) {
            let index = model.value.findIndex(e => e.id === props.selectedLamina?.id)
            if (index !== -1) {
              model.value[index] = response
            }
          }
          sweetAlert.successAlert('¡Reubicada!', 'La lamina ha sido reubicada con éxito.')
            .then(() => {
              handleCerrar()
            })
        })
      }
    })
}

watch(() => cajaSeleccionada.value, () => {
  if (cajaSeleccionada.value) {
    $fetch(`/api/caja/${cajaSeleccionada.value.id}/lamina`, {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      if (Array.isArray(response)) {
        cajaLaminas.value = response
        console.log(cajaLaminas.value)
      }
    })
  }
})

function handleCerrar() {
    cajaSeleccionada.value = null
    emit("toggle")
}
</script>

<template>
    <teleport to="body">
        <div v-if="open" class="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
            <div class="bg-white border mx-auto max-w-5xl rounded-lg p-6 my-20">
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-2xl font-semibold">Mover lamina</h1>
                </div>

                <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                    <v-select label="Caja" :items="cajas" v-model="cajaSeleccionada" variant="outlined" density="compact"></v-select>
                </div>

                <div class="overflow-auto">
                    <table class="text-left w-full">
                        <thead class="text-sm bg-gray-100">
                            <tr>
                                <th class="px-6 py-3"></th>
                                <th v-for="columna in cajaSeleccionada?.numeroColumnas" :key="columna" class="px-6 py-3 text-center">{{ columna }}</th>
                            </tr>
                        </thead>
                        <tbody v-if="cajaSeleccionada" class="bg-white">
                            <tr v-for="fila in cajaSeleccionada.numeroFilas" :key="fila">
                                <td class="text-center text-sm font-bold bg-gray-100 px-3 py-6">
                                    {{ fila }}
                                </td>
                                <th v-for="columna in cajaSeleccionada.numeroColumnas" :key="columna" class="px-6 py-3 hover:bg-gray-100">
                                    <div v-if="selectedLamina && cajaSeleccionada.id == selectedLamina.cajaId && selectedLamina.columna == columna && selectedLamina.fila == fila">
                                        <button class="flex items-center justify-center bg-lime-500 w-8 h-8 rounded-full mx-auto">
                                        </button>
                                        <div class="text-center text-xs">{{ cajaLaminas.find(l => l.columna == columna && l.fila == fila)?.id }}</div>
                                    </div>
                                    <div v-else-if="cajaLaminas.find(l => l.columna == columna && l.fila == fila)">
                                        <div class="flex items-center justify-center bg-red-500 w-8 h-8 rounded-full mx-auto">
                                        </div>
                                        <div class="text-center text-xs">{{ cajaLaminas.find(l => l.columna == columna && l.fila == fila)?.id }}</div>
                                    </div>
                                    <div v-else-if="laminas.find(l => l.cajaId == cajaSeleccionada?.id && l.columna == columna && l.fila == fila)">
                                        <button class="flex items-center justify-center bg-orange-500 w-8 h-8 rounded-full mx-auto">
                                        </button>
                                        <div class="text-center text-xs">-</div>
                                    </div>
                                    <div v-else>
                                        <button @click="handleToggleLamina(cajaSeleccionada.id, fila, columna)" class="flex items-center justify-center bg-gray-400 w-8 h-8 rounded-full mx-auto">
                                        </button>
                                        <div class="text-center text-xs">-</div>
                                    </div>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="flex justify-between mt-2">
                    <button
                        @click="handleCerrar"
                        class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </teleport>
</template>
