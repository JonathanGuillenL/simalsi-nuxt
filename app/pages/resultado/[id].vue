<script setup lang="ts">
const solicitudResponse = ref<any>(null)
const resultado = ref({
  cie: null,
  diagnostico: null
})

const errors = ref({
  cie: '',
  diagnostico: ''
})

const codigoEnfermedades = ref([])
const imageUrl = ref<string | null>(null)
const imageDescripcion = ref('')
const modalImagen = ref(false)
const archivos = ref<AdjuntarArchivoResponse[]>([])
const modalArchivo = ref(false)

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
  $fetch<any>('/api/codigo-enfermedades', {
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    codigoEnfermedades.value = response.map(item => ({
      title: item.descripcion,
      value: item.id
    }))
  }).catch(error => {
    if (!error.data.data.errors && error.data.data.error) {
      sweetAlert.errorAlert(error.data.data.error)
    }
  })

  $fetch<any>('/api/solicitud/' + id.value, {
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    solicitudResponse.value = response
    if (solicitudResponse.value.resultadoCGO) {
      archivos.value = solicitudResponse.value.resultadoCGO.archivosAdjuntos
      resultado.value = {
        cie: null,
        diagnostico: null
      }
    }
    loading.value = false
  }).catch(error => {
    if (!error.data.data.errors && error.data.data.error) {
      sweetAlert.errorAlert(error.data.data.error)
    }
  })
})

function solicitarImagen(filename: string, descripcion: string) {
  $fetch<any>('/api/resultado/download/' + filename, {
    responseType: 'blob',
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    const blob = response
    imageUrl.value = URL.createObjectURL(blob)
    imageDescripcion.value = descripcion

    modalImagen.value = true
  }).catch(error => {
    if (!error.data.data.errors && error.data.data.error) {
      sweetAlert.errorAlert(error.data.data.error)
    }
  })
}

function eliminarImagen(id: number) {
  $fetch<any>('/api/resultado/delete/' + id, {
    method: 'DELETE',
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    if (archivos.value) {
      let index = archivos.value.findIndex(e => e && e.id === id)
      if (index !== -1) {
        archivos.value[index] = response
      }
    }
  }).catch(error => {
    console.log(error)
    if (!error.data.data.errors && error.data.data.error) {
      sweetAlert.errorAlert(error.data.data.error)
    }
  })
}

function handleGuardar() {
  $fetch<any>('/api/resultado/' + id.value, {
    method: 'POST',
    body: resultado.value,
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    solicitudResponse.value.resultadoCGO = response
    archivos.value = response.archivosAdjuntos ?? []
    resultado.value = {
      cie: response.codigoEnfermedades.id,
      diagnostico: response.observaciones
    }
    sweetAlert.successAlert('Resultado registrado', 'El resultado ha sido registrado correctamente')

  }).catch(error => {
    if (!error.data.data.errors && error.data.data.error) {
      sweetAlert.errorAlert(error.data.data.error)
    } else {
      errors.value = error.data.data.errors
    }
  })
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

        <div>
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

            <div class="grid grid-cols-2 gap-x-4 gap-y-3">
              <div class="col-span-2">
                  <label for="" class="">Fecha de toma de la muestra</label>
                  <input :value="fechaTomaPrint" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>
              <div>
                  <label for="" class="">Región anatómica</label>
                  <input :value="solicitudResponse?.servicioLaboratorio?.procedimientoQuirurgico.regionAnatomica.descripcion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>
              <div>
                  <label for="" class="">Procedimiento quirúrgico</label>
                  <input :value="solicitudResponse?.servicioLaboratorio?.procedimientoQuirurgico.descripcion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>

              <div class="col-span-1">
                  <label for="" class="">Fecha de ingreso al laboratorio</label>
                  <input :value="solicitudResponse?.muestra?.fechaIngreso" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>

              <div class="col-span-1">
                  <label for="" class="">Fecha de procesamiento</label>
                  <input :value="solicitudResponse?.muestra?.fechaProcesamiento" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>

              <div class="col-span-1">
                  <label for="" class="">Número de cortes</label>
                  <input :value="solicitudResponse?.muestra?.numeroDeCortes" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>

              <div class="col-span-1">
                  <label for="" class="">Peso de la muestra</label>
                  <input :value="solicitudResponse?.muestra?.pesoMuestra" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>

              <div class="col-span-2">
                  <label for="" class="">Descripción macroscópica</label>
                  <textarea :value="solicitudResponse?.muestra?.descripcionMacroscopica" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id=""></textarea>
              </div>
            </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
              <h1 class="text-lg font-semibold">Resultado</h1>
          </div>

          <div v-if="solicitudResponse && !solicitudResponse.resultadoCGO" class="grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
            <v-select class="col-span-2" v-model="resultado.cie" :items="codigoEnfermedades" label="CIE" variant="outlined" :error-messages="errors.cie" />
            <v-textarea class="col-span-2" v-model="resultado.diagnostico" label="Diagnóstico" variant="outlined" :error-messages="errors.diagnostico" />
          </div>
          <div v-else class="grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
            <div class="col-span-2">
              <label for="" class="">Código de enfermedad</label>
              <input :value="solicitudResponse?.resultadoCGO?.codigoEnfermedades.descripcion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
            </div>

            <div class="col-span-2">
              <label for="" class="">Diagnóstico</label>
              <textarea :value="solicitudResponse?.resultadoCGO?.observaciones" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id=""></textarea>
            </div>
          </div>
        </div>

      <div v-if="solicitudResponse && solicitudResponse.resultadoCGO" class="col-span-2">
        <ArchivoModal v-model="archivos" :id="solicitudResponse.resultadoCGO.id" :open="modalArchivo" @toggle="modalArchivo = !modalArchivo"></ArchivoModal>
        <ArchivoVer v-if="imageUrl" v-model="imageDescripcion" :open="modalImagen" :image-url="imageUrl" @toggle="modalImagen = !modalImagen"></ArchivoVer>
        <button
            class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2"
            @click="modalArchivo = true"
        >
            Adjuntar imagen
        </button>
        <div class="rounded-lg border overflow-x-auto mt-5">
            <table class="text-left w-full">
                <thead class="text-sm bg-gray-100">
                    <tr>
                        <th class="px-6 py-3">ID</th>
                        <th class="px-6 py-3">Nombre de archivo</th>
                        <th class="px-6 py-3">Descripción</th>
                        <th class="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <tr v-for="(item, index) in archivos.filter((e) => e && e.deletedAt === null)" :key="index" class="border-b hover:bg-gray-50">
                        <td class="border px-6 py-3">
                            {{ item.id }}
                        </td>
                        <td class="border px-6 py-3">
                            {{ item.ubicacion }}
                        </td>
                        <td class="border px-6 py-3">
                            {{ item.descripcion }}
                        </td>
                        <td class="border pr-3 py-2">
                            <button @click="solicitarImagen(item.ubicacion, item.descripcion)" class="font-semibold text-sm text-white bg-lime-500 rounded-md hover:shadow-lg px-3 py-2">Ver</button>
                            <button @click="eliminarImagen(item.id)" class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2">X</button>
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
