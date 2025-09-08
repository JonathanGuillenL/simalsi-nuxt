<script setup lang="ts">
import useSweetAlert from '~/composables/useSweetAlert'

const props = defineProps({
  id: String,
  edit: Boolean
})

const clienteResponse = ref<ClienteResponse | null>(null)
const clienteRequest = ref<ClienteCreateRequest>({
  tipoCliente: null,
  nombre: '',
  nombres: '',
  apellidos: '',
  cedula: '',
  email: '',
  telefono: '',
  razonSocial: '',
  ruc: '',
  codigoSanitario: '',
  direccion: '',
  hasPaciente: false,
  nacimiento: null,
  sexo: null,
  pacienteId: null
})

const errors = ref({
  nombre: '',
  nombres: '',
  apellidos: '',
  cedula: '',
  email: '',
  telefono: '',
  razonSocial: '',
  ruc: '',
  codigoSanitario: '',
  direccion: '',
  nacimiento: '',
  sexo: '',
})

const sweetAlert = useSweetAlert()
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const openModal = ref(false)
const registrarPaciente = ref(false)
const id = computed(() => route.params.id)

const items = [
    { title: 'Cliente espontáneo', value: 'CLIENTE_ESPONTANEO' },
    { title: 'Médico afiliado', value: 'MEDICO_AFILIADO' },
    { title: 'Clínica afiliada', value: 'CLINICA_AFILIADA' },
]

const sexoItems = [
    { title: 'Maculino', value: 'MASCULINO' },
    { title: 'Femenino', value: 'FEMENINO' },
]

onMounted(() => {
  if (props.edit) {
    $fetch<ClienteResponse>('/api/cliente/' + id.value, {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      clienteResponse.value = response
      clienteRequest.value = {
        tipoCliente: null,
        nombre: response.nombre,
        nombres: response.nombres,
        apellidos: response.apellidos,
        cedula: response.cedula ?? '',
        email: response.email,
        telefono: response.telefono,
        razonSocial: response.razonSocial,
        ruc: response.ruc,
        codigoSanitario: response.codigoSanitario ?? '',
        direccion: response.direccion,
        hasPaciente: response.hasPaciente,
        nacimiento: response.nacimiento ?? null,
        sexo: response.sexo ?? null,
        pacienteId: null
      }
      registrarPaciente.value = props.edit && clienteResponse.value.hasPaciente
      loading.value = false
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      }
    })
  }
})

function onClickHandle() {
  if (!props.edit) {
    $fetch('/api/cliente', {
      method: 'POST',
      body: clienteRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      let message = ''

      if (typeof response === 'object' && response) {
        if ('username' in response) {
          if ('password' in response) {
            message = `Usuario: ${response.username} Contraseña: ${response.password}`
          } else {
            message = `Usuario: ${response.username}`
          }
        }
      }

      sweetAlert.successAlert('Cliente registrado', message)
            .then(() => router.push({ name: 'cliente' }))
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      } else {
        errors.value = error.data.data.errors
      }
    })
  } else {
    $fetch('/api/cliente/' + id.value, {
      method: 'PUT',
      body: clienteRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Cliente actualizado', 'El cliente ha sido actualizado correctamente')
      .then(() => {
        router.push({ name: 'cliente' })
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

function onDeleteHandler() {
  sweetAlert.confirmAlert('¿Estás seguro que deseas eliminar este cliente?')
    .then((result) => {
      if (result.isConfirmed) {
        $fetch('/api/cliente/' + id.value, {
          method: 'DELETE',
          headers: useRequestHeaders(['cookie']),
        }).then(() => {
          sweetAlert.successAlert('¡Eliminado!', 'El registro de cliente ha sido eliminado.')
            .then(() => router.push({ name: 'cliente' }))
        }).catch(error => {
          if (!error.data.data.errors && error.data.data.error) {
            sweetAlert.errorAlert(error.data.data.error)
          } else {
            errors.value = error.data.data.errors
          }
        })
      }
  })
}

function onEnableHandler() {
  $fetch('/api/cliente/' + id.value, {
    method: 'PATCH',
    headers: useRequestHeaders(['cookie']),
  }).then(() => {
    sweetAlert.successAlert('¡Habilitado!', 'El registro de cliente ha sido habilitado.')
    .then(() => {
      router.push({ name: 'cliente' })
    })
  }).catch(error => {
    errors.value = error.data.data.errors
    if (!error.data.data.errors && error.data.data.error) {
      sweetAlert.errorAlert(error.data.data.error)
    }
  })
}
</script>

<template>
  <div class="font-semibold text-xl text-stone-700 pt-8 px-10">
    <button class="text-blue-500" @click="$router.back()">Administración de clientes</button>
    /
    <span v-if="edit">{{ clienteRequest.apellidos? clienteRequest.nombres + ' ' + clienteRequest.apellidos : clienteRequest.nombre }}</span>
    <template v-else>Registrar cliente</template>
    <span v-if="clienteResponse?.deletedAt != null" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
  </div>

  <div class="bg-white rounded border shadow-lg p-6 m-6">
    <div class="flex items-center space-x-1 mb-2">
      <h1 class="text-lg font-semibold">
        <span v-if="clienteRequest.tipoCliente == 'CLINICA_AFILIADA'">Información institucional</span>
        <span v-else>Información personal</span>
      </h1>
    </div>
    <div v-if="edit && loading" class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 animate-pulse">
      <div class="space-y-2 my-3">
        <div class="bg-gray-200 w-20 h-3 rounded-lg"></div>
        <div class="bg-gray-200 h-8 rounded-lg"></div>
      </div>
      <div class="space-y-2 my-3">
        <div class="bg-gray-200 w-20 h-3 rounded-lg"></div>
        <div class="bg-gray-200 h-8 rounded-lg"></div>
      </div>
      <div class="space-y-2 my-3">
        <div class="bg-gray-200 w-20 h-3 rounded-lg"></div>
        <div class="bg-gray-200 h-8 rounded-lg"></div>
      </div>
      <div class="space-y-2 my-3">
        <div class="bg-gray-200 w-20 h-3 rounded-lg"></div>
        <div class="bg-gray-200 h-8 rounded-lg"></div>
      </div>
      <div class="space-y-2 my-3">
        <div class="bg-gray-200 w-20 h-3 rounded-lg"></div>
        <div class="bg-gray-200 h-8 rounded-lg"></div>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
      <VSelect class="col-span-1 md:col-span-2" label="Tipo de cliente" v-model="clienteRequest.tipoCliente" :items="items" variant="outlined" clearable :disabled="edit" />

      <div v-if="clienteRequest.tipoCliente == 'CLIENTE_ESPONTANEO'" class="flex col-span-1 md:col-span-2 justify-between items-center">
        <v-switch v-model="clienteRequest.hasPaciente" color="primary" label="¿Registrar perfil de paciente?" hide-details :readonly="registrarPaciente"></v-switch>
        <PacienteModal :open="openModal" v-model="clienteRequest.pacienteId" @toggle="openModal = !openModal" />
        <button v-if="clienteRequest.hasPaciente" @click="openModal = true" class="font-semibold text-sm text-white bg-blue-500 disabled:bg-gray-400 disabled:shadow-none rounded-md hover:shadow-lg px-3 py-2" :disabled="registrarPaciente">
          Seleccionar paciente existente
        </button>
      </div>

      <div v-if="clienteRequest.tipoCliente == 'MEDICO_AFILIADO'" class="flex col-span-1 md:col-span-2 justify-end items-center mb-2">
        <MedicoTratanteModal :open="openModal" v-model="clienteRequest.pacienteId" @toggle="openModal = !openModal" />
        <button @click="openModal = true" class="font-semibold text-sm text-white bg-blue-500 disabled:bg-gray-400 disabled:shadow-none rounded-md hover:shadow-lg px-3 py-2" :disabled="edit">
          Seleccionar médico tratante existente
        </button>
      </div>

      <v-text-field v-if="clienteRequest.tipoCliente == 'CLIENTE_ESPONTANEO'" v-model="clienteRequest.nombres" label="Nombres" variant="outlined" :error-messages="errors.nombres" @update:model-value="errors.nombres = ''"></v-text-field>
      <v-text-field v-if="clienteRequest.tipoCliente == 'CLIENTE_ESPONTANEO'" v-model="clienteRequest.apellidos" label="Apellidos" variant="outlined" :error-messages="errors.apellidos" @update:model-value="errors.apellidos = ''"></v-text-field>
      <v-date-input v-if="clienteRequest.tipoCliente == 'CLIENTE_ESPONTANEO' && clienteRequest.hasPaciente" v-model="clienteRequest.nacimiento" label="Fecha de nacimiento" prepend-icon="" variant="outlined" :error-messages="errors.nacimiento" @update:model-value="errors.nacimiento = ''" :readonly="edit"></v-date-input>
      <v-select v-if="clienteRequest.tipoCliente == 'CLIENTE_ESPONTANEO' && clienteRequest.hasPaciente" v-model="clienteRequest.sexo" :items="sexoItems" label="Sexo" prepend-icon="" variant="outlined" :error-messages="errors.sexo" @update:model-value="errors.sexo = ''" :readonly="edit"></v-select>
      <v-text-field v-if="clienteRequest.tipoCliente == 'CLIENTE_ESPONTANEO'" v-model="clienteRequest.cedula" label="Cédula" prepend-icon="" variant="outlined" :error-messages="errors.cedula" @update:model-value="errors.cedula = ''"></v-text-field>

      <v-text-field v-if="clienteRequest.tipoCliente == 'MEDICO_AFILIADO'" v-model="clienteRequest.nombres" label="Nombres" variant="outlined" :error-messages="errors.nombres"></v-text-field>
      <v-text-field v-if="clienteRequest.tipoCliente == 'MEDICO_AFILIADO'" v-model="clienteRequest.apellidos" label="Apellidos" variant="outlined" :error-messages="errors.apellidos"></v-text-field>
      <v-text-field v-if="clienteRequest.tipoCliente == 'MEDICO_AFILIADO'" v-model="clienteRequest.cedula" label="Cédula" variant="outlined" :error-messages="errors.cedula"></v-text-field>
      <v-text-field v-if="clienteRequest.tipoCliente == 'MEDICO_AFILIADO'" v-model="clienteRequest.codigoSanitario" label="Código sanitario" variant="outlined" :error-messages="errors.codigoSanitario" :readonly="edit"></v-text-field>

      <v-text-field v-if="clienteRequest.tipoCliente == 'CLINICA_AFILIADA'" v-model="clienteRequest.nombre" label="Nombre" variant="outlined" :error-messages="errors.nombre"></v-text-field>
      <v-text-field v-if="clienteRequest.tipoCliente == 'CLINICA_AFILIADA'" v-model="clienteRequest.razonSocial" label="Razón social" variant="outlined" :error-messages="errors.razonSocial"></v-text-field>
      <v-text-field v-if="clienteRequest.tipoCliente == 'CLINICA_AFILIADA'" v-model="clienteRequest.ruc" label="RUC" variant="outlined" :error-messages="errors.ruc"></v-text-field>

      <v-text-field v-model="clienteRequest.email" label="Correo electrónico" variant="outlined" :error-messages="errors.email"></v-text-field>
      <v-text-field v-if="edit && clienteResponse" v-model="clienteResponse.username" label="Usuario" variant="outlined" readonly ></v-text-field>
    </div>

    <div class="flex items-center space-x-1 mb-2">
      <h1 class="text-lg font-semibold">Información de contacto</h1>
    </div>
    <div v-if="edit && loading" class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 animate-pulse">
      <div class="space-y-2 my-3">
        <div class="bg-gray-200 w-20 h-3 rounded-lg"></div>
        <div class="bg-gray-200 h-8 rounded-lg"></div>
      </div>
      <div class="col-span-2 space-y-2 my-3">
        <div class="bg-gray-200 w-20 h-3 rounded-lg"></div>
        <div class="bg-gray-200 h-8 rounded-lg"></div>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
      <v-text-field v-model="clienteRequest.telefono" label="Teléfono" variant="outlined" :error-messages="errors.telefono" @update:model-value="errors.telefono = ''"></v-text-field>
      <v-text-field class="col-span-2" v-model="clienteRequest.direccion" label="Dirección" variant="outlined" :error-messages="errors.direccion" @update:model-value="errors.direccion = ''"></v-text-field>
    </div>

    <div class="flex justify-between mt-2">
      <button v-if="edit && clienteResponse?.deletedAt" class="font-semibold text-sm text-white bg-green-600 rounded-md hover:shadow-lg px-3 py-2" @click="onEnableHandler">Habilitar</button>
      <button v-else-if="edit" class="font-semibold text-sm text-white bg-red-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onDeleteHandler">Eliminar</button>
      <button v-else class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2" @click="$router.back()">Cancelar</button>
      <button class="font-semibold text-sm text-white bg-blue-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onClickHandle">Guardar</button>
    </div>
  </div>
</template>
