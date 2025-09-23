<script setup lang="ts">
import useSweetAlert from '~/composables/useSweetAlert'
import { SimalsiRoles } from '~/constants/roles'

const props = defineProps({
  id: String,
  edit: Boolean
})

const pacienteResponse = ref<PacienteResponse | null>(null)
const pacienteRequest = ref<PacienteCreateRequest>({
  nombres: '',
  apellidos: '',
  nacimiento: null,
  sexo: null,
  telefono: '',
  direccion: ''
})

const errors = ref({
    nombres: '',
    apellidos: '',
    nacimiento: '',
    sexo: '',
    telefono: '',
})

const sweetAlert = useSweetAlert()
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const id = computed(() => route.params.id)
const edad = computed(() => {
  if (!pacienteRequest.value.nacimiento) return ''
  const today = new Date()
  const birthDate = new Date(pacienteRequest.value.nacimiento)
  let age = today.getFullYear() - birthDate.getFullYear()
  const month = today.getMonth() - birthDate.getMonth()
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
})

const sexoItems = [
    { title: 'Masculino', value: 'MASCULINO' },
    { title: 'Femenino', value: 'FEMENINO' },
]

onMounted(() => {
  if (props.edit) {
    $fetch<PacienteResponse>('/api/paciente/' + id.value, {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      pacienteResponse.value = response
      pacienteRequest.value = response
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
    $fetch('/api/paciente', {
      method: 'POST',
      body: pacienteRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Paciente registrado', 'El paciente ha sido registrado correctamente')
            .then(() => router.push({ name: 'paciente' }))
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      } else {
        errors.value = error.data.data.errors
      }
    })
  } else {
    $fetch('/api/paciente/' + id.value, {
      method: 'PUT',
      body: pacienteRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Paciente actualizado', 'El paciente ha sido actualizado correctamente')
      .then(() => {
        router.push({ name: 'paciente' })
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
  sweetAlert.confirmAlert('¿Estás seguro que deseas eliminar este paciente?')
    .then((result) => {
      if (result.isConfirmed) {
        $fetch('/api/paciente/' + id.value, {
          method: 'DELETE',
          headers: useRequestHeaders(['cookie']),
        }).then(() => {
          sweetAlert.successAlert('¡Eliminado!', 'El registro de paciente ha sido eliminado.')
            .then(() => router.push({ name: 'paciente' }))
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
  $fetch('/api/paciente/' + id.value, {
    method: 'PATCH',
    headers: useRequestHeaders(['cookie']),
  }).then(() => {
    sweetAlert.successAlert('¡Habilitado!', 'El registro de paciente ha sido habilitado.')
    .then(() => {
      router.push({ name: 'paciente' })
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
    <button class="text-blue-500" @click="$router.back()">Administración de pacientes</button>
    /
    <span v-if="edit">{{ pacienteRequest?.nombres + ' ' + pacienteRequest?.apellidos }}</span>
    <template v-else>Registrar paciente</template>
    <span v-if="pacienteResponse?.deletedAt != null" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
  </div>

  <div class="bg-white rounded border shadow-lg p-6 m-6">
    <div class="flex items-center space-x-1 mb-2">
      <h1 class="text-lg font-semibold">Información personal</h1>
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
      <v-text-field v-model="pacienteRequest.nombres" label="Nombres" variant="outlined" :error-messages="errors.nombres" @update:model-value="errors.nombres = ''"></v-text-field>
      <v-text-field v-model="pacienteRequest.apellidos" label="Apellidos" variant="outlined" :error-messages="errors.apellidos" @update:model-value="errors.apellidos = ''"></v-text-field>

      <v-date-input v-model="pacienteRequest.nacimiento" label="Fecha de nacimiento" prepend-icon="" variant="outlined" :error-messages="errors.nacimiento" @update:model-value="errors.nacimiento = ''"></v-date-input>
      <v-text-field v-if="edit && pacienteResponse" v-model="edad" label="edad" prepend-icon="" variant="outlined" readonly></v-text-field>
      <v-select v-model="pacienteRequest.sexo" :items="sexoItems" label="Sexo" prepend-icon="" variant="outlined" :error-messages="errors.sexo"  @update:model-value="errors.sexo = ''"></v-select>
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
      <v-text-field v-model="pacienteRequest.telefono" label="Teléfono" variant="outlined" :error-messages="errors.telefono"  @update:model-value="errors.telefono = ''"></v-text-field>
      <v-text-field class="col-span-2" v-model="pacienteRequest.direccion" label="Dirección" variant="outlined"></v-text-field>
    </div>

    <div class="flex justify-between mt-2">
      <AuthState>
        <template #default="{ user }">
          <button v-if="edit && pacienteResponse?.deletedAt && user?.roles.includes(SimalsiRoles.ROLE_ADMIN)" class="font-semibold text-sm text-white bg-green-600 rounded-md hover:shadow-lg px-3 py-2" @click="onEnableHandler">Habilitar</button>
          <button v-else-if="edit && user?.roles.includes(SimalsiRoles.ROLE_ADMIN)" class="font-semibold text-sm text-white bg-red-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onDeleteHandler">Eliminar</button>
          <button v-else class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2" @click="$router.back()">Cancelar</button>
        </template>
        <template #placeholder>
          <button class="text-sm font-semibold hover:text-blue-500" disabled>
            <span class="animate-pulse">Cargando...</span>
          </button>
        </template>
      </AuthState>
      <button class="font-semibold text-sm text-white bg-blue-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onClickHandle">Guardar</button>
    </div>
  </div>
</template>
