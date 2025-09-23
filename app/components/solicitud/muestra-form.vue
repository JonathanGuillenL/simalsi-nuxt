<script setup lang="ts">
const props = defineProps<{
  edit?: boolean
}>()

const solicitudResponse = ref<any>(null)
const muestra = ref({
    fechaIngreso: '',
    fechaProcesamiento: '',
    numeroDeCortes: null,
    pesoMuestra: null,
    descripcionMacroscopica: '',
    laminas: []
})

const errors = ref({
    fechaIngreso: '',
    fechaProcesamiento: '',
    numeroDeCortes: '',
    pesoMuestra: '',
    descripcionMacroscopica: ''
})

const modalLamina = ref(false)
const selectedLamina = ref<LaminaCaja | null>(null)
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const sweetAlert = useSweetAlert()
const id = computed(() => Number(route.params.id ?? 0))

const fechaTomaPrint = computed(() => {
    if (solicitudResponse.value?.fechaTomaMuestra != null) {
      return (new Date(solicitudResponse.value?.fechaTomaMuestra)).toLocaleString('es-NI')
    }

    return ''
})

onMounted(() => {
  $fetch<any>('/api/solicitud/' + id.value, {
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    solicitudResponse.value = response
    if (response.muestra) {
      muestra.value = response.muestra
    }
    console.log(muestra.value)
    loading.value = false
  }).catch(error => {
    if (!error.data.data.errors && error.data.data.error) {
      sweetAlert.errorAlert(error.data.data.error)
    }
  })
})

function handleGuardar() {
  if (!props.edit) {
    $fetch('/api/muestra/' + id.value, {
      method: 'POST',
      body: muestra.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Datos de muestra registrados', 'Los datos de la muestra han sido registrados correctamente')
        .then(() => {
          router.push({ name: 'solicitud' })
        })
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      } else {
        errors.value = error.data.data.errors
      }
    })
  } else {
    $fetch('/api/muestra/' + id.value, {
      method: 'PUT',
      body: muestra.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Datos de muestra actualizados', 'Los datos de la muestra han sido actualizados correctamente')
      .then(() => {
        router.push({ name: 'historial' })
      })
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      } else {
        errors.value = error.data.data.errors
      }
    })
  }
}

function validateIngreso(date: unknown) {
  return date instanceof Date && date <= new Date() && date >= new Date((new Date(solicitudResponse.value.fechaSolicitud)).setHours(0, 0, 0, 0));
}

function validateProcesamiento(date: unknown) {
  return date instanceof Date && date >= (new Date(muestra.value.fechaIngreso) ?? new Date()) && date <= new Date()
}
</script>

<template>
<div class="font-semibold text-xl text-stone-700 pt-8 px-10">
        <router-link class="text-blue-500" :to="{ name: 'solicitud' }">Administración de solicitudes</router-link>
        /
        <span v-if="solicitudResponse">N&ordm;{{ String(solicitudResponse?.id).padStart(5, '0') }}</span>
    </div>

    <div v-if="solicitudResponse" class="bg-white rounded border shadow-lg p-6 m-6 space-y-5">

        <h1 class="text-lg font-semibold">Información de solicitud</h1>
        <div class="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
                <label for="" class="">Número de solicitud</label>
                <input :value="String(solicitudResponse?.id).padStart(5, '0')" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
            </div>
            <div>
                <label for="" class="">Fecha de solicitud</label>
                <input :value="(new Date(solicitudResponse.fechaSolicitud)).toLocaleString('es-CA')" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
            </div>
        </div>
        <div>
            <div class="flex items-center space-x-1 mb-2">
                <h1 class="text-lg font-semibold">Información del cliente</h1>
                <div v-if="solicitudResponse?.cliente?.tipoCliente == 'CLIENTE_ESPONTANEO'" class="text-xs bg-lime-500 text-white font-semibold rounded-xl py-1 px-2">Cliente espontáneo</div>
                <div v-else-if="solicitudResponse?.cliente?.tipoCliente == 'MEDICO_AFILIADO'" class="text-xs bg-orange-500 text-white font-semibold rounded-xl py-1 px-2">Médico afiliado</div>
                <div v-else-if="solicitudResponse?.cliente?.tipoCliente == 'CLINICA_AFILIADA'" class="text-xs bg-indigo-500 text-white font-semibold rounded-xl py-1 px-2">Clínica afiliada</div>
            </div>

            <div v-if="solicitudResponse?.cliente.tipoCliente == 'CLIENTE_ESPONTANEO'" class="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                    <label for="" class="">Nombres</label>
                    <input :value="solicitudResponse?.cliente?.persona.nombre" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Apellidos</label>
                    <input :value="solicitudResponse?.cliente?.persona.apellido" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Cédula</label>
                    <input :value="solicitudResponse?.cliente?.persona.numeroIdentificacion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Teléfono</label>
                    <input :value="solicitudResponse?.cliente?.persona.telefono" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Dirección</label>
                    <input :value="solicitudResponse?.cliente?.persona.direccion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
            </div>
            <div v-else-if="solicitudResponse?.cliente.tipoCliente == 'MEDICO_AFILIADO'" class="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                    <label for="" class="">Nombres</label>
                    <input :value="solicitudResponse?.cliente?.persona.nombre" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Apellidos</label>
                    <input :value="solicitudResponse?.cliente?.persona.apellido" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Cédula</label>
                    <input :value="solicitudResponse?.cliente?.persona.numeroIdentificacion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Teléfono</label>
                    <input :value="solicitudResponse?.cliente?.persona.telefono" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Dirección</label>
                    <input :value="solicitudResponse?.cliente?.persona.direccion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
            </div>
            <div v-else-if="solicitudResponse?.cliente.tipoCliente == 'CLINICA_AFILIADA'" class="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                    <label for="" class="">Nombre</label>
                    <input :value="solicitudResponse?.cliente?.persona.nombre" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Razón social</label>
                    <input :value="solicitudResponse?.cliente?.persona.razonSocial" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">RUC</label>
                    <input :value="solicitudResponse?.cliente?.persona.ruc" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Teléfono</label>
                    <input :value="solicitudResponse?.cliente?.persona.telefono" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Dirección</label>
                    <input :value="solicitudResponse?.cliente?.persona.direccion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
            </div>
        </div>

        <div>
            <div class="flex items-center space-x-1 mb-2">
                <h1 class="text-lg font-semibold">Información del paciente</h1>
            </div>

            <div class="grid grid-cols-2 gap-x-4 gap-y-3">
                <div class="col-span-2">
                    <label for="" class="">Nombre</label>
                    <input :value="solicitudResponse.paciente?.persona?.nombre" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
                </div>
                <div>
                    <label for="" class="">Fecha de nacimiento</label>
                    <input :value="solicitudResponse.paciente?.nacimiento" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
                </div>
                <div>
                    <label for="" class="">Edad</label>
                    <input :value="solicitudResponse.paciente?.edad" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
                </div>
                <div>
                    <label for="" class="">Sexo</label>
                    <input :value="solicitudResponse.paciente?.sexo" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
                </div>
                <div>
                    <label for="" class="">Teléfono</label>
                    <input :value="solicitudResponse.paciente?.persona?.telefono" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
                </div>
            </div>
        </div>

        <div v-if="solicitudResponse.medicoTratante">
            <div class="flex items-center space-x-1 mb-2">
                <h1 class="text-lg font-semibold">Información del médico tratante</h1>
            </div>

            <div class="grid grid-cols-2 gap-x-4 gap-y-3">
                <div class="col-span-2">
                    <label for="" class="">Nombres</label>
                    <input :value="solicitudResponse.medicoTratante?.persona?.nombre + ' ' + solicitudResponse.medicoTratante?.persona?.apellido" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
                </div>
                <div>
                    <label for="" class="">Código sanitario</label>
                    <input :value="solicitudResponse.medicoTratante?.codigoSanitario" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
                </div>
                <div>
                    <label for="" class="">Teléfono</label>
                    <input :value="solicitudResponse.medicoTratante?.persona?.telefono" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
                </div>
            </div>
        </div>

        <div>
            <div class="flex items-center justify-between mb-2">
                <h1 class="text-lg font-semibold">Datos de la muestra</h1>
            </div>

            <div v-if="!solicitudResponse.muestra" class="grid grid-cols-2 gap-x-4 gap-y-3">
                <div class="col-span-2">
                    <label for="" class="">Fecha de toma de la muestra</label>
                    <input :value="fechaTomaPrint" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
                </div>
                <div class="col-span-2">
                    <label for="" class="">Procedimiento quirúrgico</label>
                    <input :value="solicitudResponse.servicioLaboratorio.procedimientoQuirurgico?.descripcion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
                </div>

                <div class="col-span-2">
                    <label for="" class="">Observaciones</label>
                    <textarea :value="solicitudResponse.observaciones" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id=""></textarea>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
          <v-date-input v-model="muestra.fechaIngreso" :allowed-dates="validateIngreso" label="Fecha de ingreso al laboratorio" prepend-icon="" variant="outlined" :error-messages="errors.fechaIngreso" @update:model-value="muestra.fechaProcesamiento = ''"></v-date-input>
          <v-date-input v-model="muestra.fechaProcesamiento" :allowed-dates="validateProcesamiento" label="Fecha de procesamiento" prepend-icon="" variant="outlined" :error-messages="errors.fechaProcesamiento"></v-date-input>

          <v-text-field v-model="muestra.numeroDeCortes" label="Número de cortes" variant="outlined" :error-messages="errors.numeroDeCortes"></v-text-field>
          <v-text-field v-model="muestra.pesoMuestra" label="Peso de la muestra (gramos)" variant="outlined" :error-messages="errors.pesoMuestra"></v-text-field>

          <v-textarea v-model="muestra.descripcionMacroscopica" class="col-span-2" label="Descripción macroscópica" variant="outlined" :error-messages="errors.descripcionMacroscopica"></v-textarea>
        </div>

          <div class="col-span-2">
              <LaminaMoveModal v-if="edit" v-model="muestra.laminas" :selected-lamina="selectedLamina" :open="modalLamina" @toggle="modalLamina = !modalLamina"></LaminaMoveModal>
              <LaminaModal v-else v-model="muestra.laminas" :open="modalLamina" @toggle="modalLamina = !modalLamina"></LaminaModal>
              <button
                v-if="!solicitudResponse.muestra"
                class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2"
                @click="modalLamina = true"
              >
                  Agregar lamina
              </button>
              <div class="rounded-lg border overflow-x-auto mt-5">
                  <table class="text-left w-full">
                      <thead class="text-sm bg-gray-100">
                          <tr>
                              <th v-if="edit" class="px-6 py-3">ID</th>
                              <th class="px-6 py-3">Caja</th>
                              <th class="px-6 py-3">Ubicación</th>
                              <th v-if="edit" class="px-6 py-3">Acciones</th>
                          </tr>
                      </thead>
                      <tbody class="bg-white">
                          <tr v-for="(item, index) in muestra.laminas.toSorted((a, b) => a.id - b.id)" :key="index" class="border-b hover:bg-gray-50">
                              <td v-if="edit" class="border px-6 py-3">
                                  {{ item.id }}
                              </td>
                              <td class="border px-6 py-3">
                                  {{ item.cajaId }}
                              </td>
                              <td class="border px-6 py-3">
                                  {{ 'F' + item.fila + '-C' + item.columna }}
                              </td>
                              <td v-if="edit" class="border px-6 py-3">
                                <button @click="selectedLamina = item; modalLamina = true" class="font-semibold text-sm text-white bg-lime-500 rounded-md hover:shadow-lg px-3 py-2">Mover</button>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

      <div class="text-sm">Los campos marcados con (<span class="text-red-500">*</span>) son requeridos</div>
      <div class="flex justify-end mt-5">
          <button
              @click="handleGuardar"
              class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2"
          >
              Guardar
          </button>
      </div>
    </div>
</template>
