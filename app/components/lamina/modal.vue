<script setup lang="ts">
defineProps<{
    open: boolean,
}>()

const model = defineModel<LaminaCaja[]>()

const laminas = ref<LaminaCaja[]>([])

const cajas = ref<any[]>([])
const cajaSeleccionada = ref<CajaResponse | null>(null)
const cajaLaminas = ref<any[]>([])

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
    const index = laminas.value.findIndex(
        l => l.cajaId == cajaId && l.fila == fila && l.columna == columna
    )
    console.log(index)

    if (index !== -1) {
        laminas.value.splice(index, 1)
    } else {
        laminas.value.push({ id: 0, cajaId, fila, columna })
    }
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

function handleAgregar() {
    model.value = JSON.parse(JSON.stringify(laminas.value))
    emit("toggle")
}
</script>

<template>
    <teleport to="body">
        <div v-if="open" class="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
            <div class="bg-white border mx-auto max-w-5xl rounded-lg p-6 my-20">
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-2xl font-semibold">Agregar lamina</h1>
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
                                    <div v-if="cajaLaminas.find(l => l.columna == columna && l.fila == fila)">
                                        <div class="flex items-center justify-center bg-red-500 w-8 h-8 rounded-full mx-auto">
                                        </div>
                                        <div class="text-center text-xs">{{ cajaLaminas.find(l => l.columna == columna && l.fila == fila)?.id }}</div>
                                    </div>
                                    <div v-else-if="laminas.find(l => l.cajaId == cajaSeleccionada?.id && l.columna == columna && l.fila == fila)">
                                        <button @click="handleToggleLamina(cajaSeleccionada.id, fila, columna)" class="flex items-center justify-center bg-orange-500 w-8 h-8 rounded-full mx-auto">
                                        </button>
                                        <div class="text-center text-xs">-</div>
                                    </div>
                                    <div  v-else>
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
                        @click="$emit('toggle')"
                        class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2">
                        Cancelar
                    </button>
                    <button
                        @click="handleAgregar"
                        class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2">
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    </teleport>
</template>
