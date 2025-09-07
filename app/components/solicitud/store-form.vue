<script setup lang="ts">
const router = useRouter()
const sweetAlert = useSweetAlert()

const modalCliente = ref(false)
const clienteNombre = ref('')

const modalPaciente = ref(false)
const paciente = ref<PacientePageResponse | null>(null)

const modalMedicoTratante = ref(false)
const medicoTratante = ref<MedicoTratantePageResponse | null>(null)

const modalServicio = ref(false)
const servicio = ref<any | null>(null)

const time = ref(null)
const fechaTomaTemp = ref<Date | null>(null)
const showMenu = ref(false)
const fechaTomaString = computed(() => {
    if (fechaTomaTemp.value !== null) {
        const dateSring = fechaTomaTemp.value.toLocaleDateString('en-CA')
        return dateSring + 'T' + (time.value? time.value : '') + ':00'
    }

    return ''
})
const fechaTomaPrint = computed(() => {
    if (fechaTomaString.value != null && fechaTomaString.value != '') {
        return (new Date(fechaTomaString.value)).toLocaleString('es-NI')
    }

    return ''
})

const solicitud = ref<SolicitudCreateRequest>({
  clienteId: 100,
  pacienteId: null,
  medicoTratanteId: null,
  servicioLaboratorioId: 100,
  fechaTomaMuestra: null,
  observaciones: null,
})

const errors = ref({
  clienteId: '',
  pacienteId: '',
  medicoTratanteId: '',
  servicioLaboratorioId: '',
  fechaTomaMuestra: '',
})

function actualizarClienteSolicitado(pacienteResponse: PacientePageResponse) {
  paciente.value = pacienteResponse
}

function actualizarMedicoTratante(medicoTratanteResponse: MedicoTratantePageResponse) {
  medicoTratante.value = medicoTratanteResponse
}

function actualizarServicio(servicioResponse: any) {
  servicio.value = servicioResponse
}

function saveHandler() {
  solicitud.value.fechaTomaMuestra = fechaTomaString.value

  $fetch('/api/solicitud/', {
    method: 'POST',
    body: solicitud.value,
    headers: useRequestHeaders(['cookie']),
  }).then(() => {
    sweetAlert.successAlert('Solicitud registrada', 'La solicitud ha sido registrada correctamente')
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
}
</script>

<template>
  <div class="font-semibold text-xl text-stone-700 pt-8 px-10">
    <router-link class="text-blue-500" :to="{ name: 'solicitud' }">Administración de solicitudes</router-link>
    /Registrar solicitud
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 m-6">
    <div class="overflow-y-auto space-y-5">

      <div class="bg-white rounded border overflow-hidden shadow-lg">
        <div class="flex items-center justify-between bg-sky-800 mb-2 px-6 pt-6 pb-3">
          <h1 class="text-2xl text-white font-semibold">Buscar Cliente (<span class="text-red-500">*</span>)</h1>
        </div>

        <div class="px-6 pt-3 pb-6">
          <div class="text-base text-neutral-600 mb-4">Seleccione el cliente que solicita el servicio</div>

          <div class="flex justify-between items-start space-x-5">
            <div class="w-2/3">
              <v-text-field :model-value="clienteNombre" label="Cliente" variant="outlined" density="compact" :error-messages="errors.clienteId" :readonly="true"></v-text-field>
            </div>
            <button @click="console.log(solicitud)" class="font-semibold text-sm text-white bg-blue-600 rounded-md hover:shadow-lg w-1/3 px-3 py-2"
            >
              Seleccionar cliente
            </button>
            <!--<BuscarCliente :open="openModalCliente" :model-value="solicitud.clienteId" @update:model-value="actualizarClienteSolicitado" @toggle="toggleModalCliente"></BuscarCliente> -->
          </div>
        </div>
      </div>

    <div class="bg-white rounded border overflow-hidden shadow-lg">
      <div class="flex items-center justify-between bg-sky-800 mb-2 px-6 pt-6 pb-3">
        <h1 class="text-2xl text-white font-semibold">Buscar paciente (<span class="text-red-500">*</span>)</h1>
      </div>

      <div class="px-6 pt-3 pb-6">
        <div class="text-base text-neutral-600 mb-4">seleccione el paciente que recibira el servicio</div>

        <div class="flex justify-between items-start space-x-5">
          <div class="w-2/3">
            <v-text-field :model-value="paciente?.nombre" label="Paciente" variant="outlined" density="compact" :error-messages="errors.pacienteId" :readonly="true"></v-text-field>
          </div>
          <button @click="modalPaciente = true" class="font-semibold text-sm text-white bg-blue-600 rounded-md hover:shadow-lg w-1/3 px-3 py-2"
          >
            Seleccionar paciente
          </button>
          <PacienteModal :open="modalPaciente" v-model="solicitud.pacienteId" @selected="actualizarClienteSolicitado" @toggle="modalPaciente = !modalPaciente" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded border overflow-hidden shadow-lg">
      <div class="flex items-center justify-between bg-sky-800 mb-2 px-6 pt-6 pb-3">
        <h1 class="text-2xl text-white font-semibold">Buscar médico tratante</h1>
      </div>

      <div class="px-6 pt-3 pb-6">
        <div class="text-base text-neutral-600 mb-4">seleccione el médico tratante que recibira el servicio</div>
        <div class="flex justify-between items-start space-x-5">
          <div class="w-2/3">
            <v-text-field :model-value="medicoTratante?.nombre" label="Medico tratante" variant="outlined" density="compact" :readonly="true"></v-text-field>
          </div>
          <button class="font-semibold text-sm text-white bg-blue-600 disabled:bg-gray-400 disabled:shadow-none rounded-md hover:shadow-lg w-1/3 px-3 py-2"
            @click="modalMedicoTratante = true"
          >
            Seleccionar medico
          </button>
          <MedicoTratanteModal :open="modalMedicoTratante" v-model="solicitud.medicoTratanteId" @selected="actualizarMedicoTratante" @toggle="modalMedicoTratante = !modalMedicoTratante" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded border overflow-hidden shadow-lg">
      <div class="flex items-center justify-between bg-sky-800 mb-2 px-6 pt-6 pb-3">
        <h1 class="text-2xl text-white font-semibold">Datos de la muestra</h1>
      </div>

      <div class="px-6 pt-3 pb-6">
        <div class="grid grid-cols-2 gap-x-5">
          <v-text-field
            :model-value="time"
            label="Hora de toma"
            variant="outlined"
            density="compact"
            :error-messages="errors.fechaTomaMuestra"
            readonly
          >
            <v-menu
              v-model="showMenu"
              :close-on-content-click="false"
              activator="parent"
              min-width="0"
            >
              <v-time-picker v-model="time"></v-time-picker>
            </v-menu>
          </v-text-field>
          <VDateInput v-model="fechaTomaTemp" label="Fecha de toma de muestra" prepend-icon="" density="compact" :error-messages="errors.fechaTomaMuestra" variant="outlined"></VDateInput>
        </div>
        <div class="flex justify-between items-start space-x-5">
          <div class="w-2/3">
            <v-text-field :model-value="servicio?.descripcion" label="Procedimiento quirúrgico" variant="outlined" density="compact" :error-messages="errors.servicioLaboratorioId" :readonly="true"></v-text-field>
          </div>
          <button @click="modalServicio = true" class="font-semibold text-sm text-white bg-blue-600 rounded-md hover:shadow-lg w-1/3 px-3 py-2"
          >
            Seleccionar procedimiento
          </button>
          <!-- <BuscarServicioLaboratorio :open="modalServicio" v-model="solicitud.servicioLaboratorioId" @selected="actualizarServicio" @toggle="modalServicio = !modalServicio"></BuscarServicioLaboratorio> -->
        </div>
      </div>
    </div>

    <div class="bg-white rounded border overflow-hidden shadow-lg">
      <div class="flex items-center justify-between bg-sky-800 mb-2 px-6 pt-6 pb-3">
          <h1 class="text-2xl text-white font-semibold">Observaciones</h1>
      </div>

      <div class="px-6 pt-3 pb-6">
          <div class="grid grid-cols-1 gap-x-3 gap-y-4">
              <v-textarea v-model="solicitud.observaciones" label="" variant="outlined" density="compact"></v-textarea>
          </div>
      </div>
    </div>
  </div>

    <div class="sticky top-20 bg-white rounded border shadow-lg space-y-5 h-fit p-6">
      <h1 class="text-2xl font-semibold">Resumen</h1>

      <!--<div>
          <div class="flex items-center space-x-1 mb-2">
              <h1 class="text-lg font-semibold">Solicitado por:</h1>
              <div v-if="cliente?.tipoCliente == 'CLIENTE_ESPONTANEO'" class="text-xs bg-lime-500 text-white font-semibold rounded-xl py-1 px-2">Cliente espontáneo</div>
              <div v-else-if="cliente?.tipoCliente == 'MEDICO_AFILIADO'" class="text-xs bg-orange-500 text-white font-semibold rounded-xl py-1 px-2">Médico afiliado</div>
              <div v-else-if="cliente?.tipoCliente == 'CLINICA_AFILIADA'" class="text-xs bg-indigo-500 text-white font-semibold rounded-xl py-1 px-2">Clínica afiliada</div>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-3">
              <div class="col-span-2">
                  <input :value="clienteNombre" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>
          </div>
      </div>-->

      <div>
          <div class="flex items-center space-x-1 mb-2">
              <h1 class="text-lg font-semibold">Información del paciente</h1>
          </div>

          <div class="grid grid-cols-2 gap-x-4 gap-y-3">
              <div class="col-span-2">
                  <label for="" class="">Nombre</label>
                  <input :value="paciente?.nombre" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>
              <div>
                  <label for="" class="">Fecha de nacimiento</label>
                  <input :value="paciente?.nacimiento" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>
              <div>
                  <label for="" class="">Edad</label>
                  <input :value="paciente?.edad" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>
              <div>
                  <label for="" class="">Sexo</label>
                  <input :value="paciente?.sexo" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>
              <div>
                  <label for="" class="">Teléfono</label>
                  <input :value="paciente?.telefono" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>
          </div>
      </div>

      <div v-if="medicoTratante">
          <div class="flex items-center space-x-1 mb-2">
              <h1 class="text-lg font-semibold">Información del médico tratante</h1>
          </div>

          <div class="grid grid-cols-2 gap-x-4 gap-y-3">
              <div class="col-span-2">
                  <label for="" class="">Nombres</label>
                  <input :value="medicoTratante?.nombre" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>
              <div>
                  <label for="" class="">Código sanitario</label>
                  <input :value="medicoTratante?.codigoSanitario" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>
              <div>
                  <label for="" class="">Teléfono</label>
                  <input :value="medicoTratante?.telefono" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
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
              <div class="col-span-2">
                  <label for="" class="">Procedimiento quirúrgico</label>
                  <input :value="servicio?.descripcion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
              </div>

              <div class="col-span-2">
                  <label for="" class="">Observaciones</label>
                  <textarea :value="solicitud.observaciones" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id=""></textarea>
              </div>
          </div>
      </div>

      <div class="text-sm">Los campos marcados con (<span class="text-red-500">*</span>) son requeridos</div>
      <div class="flex justify-end mt-5">
        <button
          class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2"
          @click="saveHandler"
        >
            Crear solicitud
        </button>
      </div>
    </div>
  </div>
</template>
