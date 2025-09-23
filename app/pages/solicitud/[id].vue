<script setup lang="ts">
import { SimalsiRoles } from '~/constants/roles'

const solicitudResponse = ref<any>(null)

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
    loading.value = false
  }).catch(error => {
    if (!error.data.data.errors && error.data.data.error) {
      sweetAlert.errorAlert(error.data.data.error)
    }
  })
})

function eliminarSolicitud() {
  sweetAlert.confirmAlert('¿Estás seguro que deseas eliminar esta solicitud?')
    .then((result) => {
      if (result.isConfirmed) {
        $fetch('/api/solicitud/' + id.value, {
          method: 'DELETE',
          headers: useRequestHeaders(['cookie']),
        }).then(() => {
          sweetAlert.successAlert('¡Eliminada!', 'La solicitud ha sido eliminada con éxito.')
        }).catch(error => {
          if (!error.data.data.errors && error.data.data.error) {
            sweetAlert.errorAlert(error.data.data.error)
          }
        })
      }
    })
}
</script>

<template>
  <div class="font-semibold text-xl text-stone-700 pt-8 px-10">
      <button class="text-blue-500" @click="$router.back()">Administración de solicitudes</button>
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
        <div v-else class="grid grid-cols-2 gap-x-4 gap-y-3">
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
              <label for="" class="">Númeo de cortes</label>
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

          <div class="col-span-2">
              <label for="" class="">Observaciones</label>
              <textarea :value="solicitudResponse.observaciones" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id=""></textarea>
          </div>
        </div>
    </div>
    <div class="mt-4">
      <AuthState>
        <template #default="{ user }">
          <button
            v-if="user?.roles?.includes(SimalsiRoles.ROLE_ADMIN) && !solicitudResponse.deletedAt"
            @click="eliminarSolicitud"
            class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2 mb-4"
          >Eliminar</button>
          <div v-else></div>
        </template>
        <template #placeholder>
          <button class="text-sm font-semibold hover:text-blue-500" disabled>
            <span class="animate-pulse">Cargando...</span>
          </button>
        </template>
      </AuthState>
    </div>
  </div>
</template>
