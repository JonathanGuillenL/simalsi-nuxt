<script setup lang="ts">
import useSweetAlert from '~/composables/useSweetAlert'

const props = defineProps({
  id: String,
  edit: Boolean
})

const medicoResponse = ref<MedicoTratanteResponse | null>(null)
const medicoRequest = ref<MedicoTratanteCreateRequest>({
  nombres: '',
  apellidos: '',
  codigoSanitario: '',
  telefono: '',
  direccion: ''
})

const errors = ref({
    nombres: '',
    apellidos: '',
    codigoSanitario: '',
    telefono: '',
})

const sweetAlert = useSweetAlert()
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const id = computed(() => route.params.id)

onMounted(() => {
  if (props.edit) {
    $fetch<MedicoTratanteResponse>('/api/medico-tratante/' + id.value, {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      medicoResponse.value = response
      medicoRequest.value = response
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
    $fetch('/api/medico-tratante', {
      method: 'POST',
      body: medicoRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Médico tratante registrado', 'El médico tratante ha sido registrado correctamente')
            .then(() => router.push({ name: 'medico-tratante' }))
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      } else {
        errors.value = error.data.data.errors
      }
    })
  } else {
    $fetch('/api/medico-tratante/' + id.value, {
      method: 'PUT',
      body: medicoRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Médico tratante actualizado', 'El médico tratante ha sido actualizado correctamente')
      .then(() => {
        router.push({ name: 'medico-tratante' })
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
  sweetAlert.confirmAlert('¿Estás seguro que deseas eliminar este médico tratante?')
    .then((result) => {
      if (result.isConfirmed) {
        $fetch('/api/medico-tratante/' + id.value, {
          method: 'DELETE',
          headers: useRequestHeaders(['cookie']),
        }).then(() => {
          sweetAlert.successAlert('¡Eliminado!', 'El registro de médico tratante ha sido eliminado.')
            .then(() => router.push({ name: 'medico-tratante' }))
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
  $fetch('/api/medico-tratante/' + id.value, {
    method: 'PATCH',
    headers: useRequestHeaders(['cookie']),
  }).then(() => {
    sweetAlert.successAlert('¡Habilitado!', 'El registro de médico tratante ha sido habilitado.')
    .then(() => {
      router.push({ name: 'medico-tratante' })
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
    <button class="text-blue-500" @click="$router.back()">Administración de médicos tratantes</button>
    /
    <span v-if="edit">{{ medicoRequest?.nombres + ' ' + medicoRequest?.apellidos }}</span>
    <template v-else>Registrar médico tratante</template>
    <span v-if="medicoResponse?.deletedAt != null" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
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
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
      <v-text-field v-model="medicoRequest.nombres" label="Nombres" variant="outlined" :error-messages="errors.nombres" @update:model-value="errors.nombres = ''"></v-text-field>
      <v-text-field v-model="medicoRequest.apellidos" label="Apellidos" variant="outlined" :error-messages="errors.apellidos" @update:model-value="errors.apellidos = ''"></v-text-field>

      <v-text-field v-model="medicoRequest.codigoSanitario" label="Código Sanitario" variant="outlined" :error-messages="errors.codigoSanitario" @update:model-value="errors.codigoSanitario = ''"></v-text-field>
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
      <v-text-field v-model="medicoRequest.telefono" label="Teléfono" variant="outlined" :error-messages="errors.telefono"  @update:model-value="errors.telefono = ''"></v-text-field>
      <v-text-field class="col-span-2" v-model="medicoRequest.direccion" label="Dirección" variant="outlined"></v-text-field>
    </div>

    <div class="flex justify-between mt-2">
      <button v-if="edit && medicoResponse?.deletedAt" class="font-semibold text-sm text-white bg-green-600 rounded-md hover:shadow-lg px-3 py-2" @click="onEnableHandler">Habilitar</button>
      <button v-else-if="edit" class="font-semibold text-sm text-white bg-red-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onDeleteHandler">Eliminar</button>
      <button v-else class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2" @click="$router.back()">Cancelar</button>
      <button class="font-semibold text-sm text-white bg-blue-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onClickHandle">Guardar</button>
    </div>
  </div>
</template>
