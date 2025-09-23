<script setup lang="ts">
import useSweetAlert from '~/composables/useSweetAlert'

const props = defineProps({
  id: String,
  edit: Boolean
})

const colaboradorResponse = ref<ColaboradorResponse | null>(null)
const colaboradorRequest = ref<ColaboradorRequest>({
  nombres: '',
  apellidos: '',
  numeroIdentificacion: '',
  codigoSanitario: '',
  telefono: '',
  username: '',
  email: '',
  user: true,
  cargoId: null
})

const errors = ref({
  nombres: '',
  apellidos: '',
  numeroIdentificacion: '',
  codigoSanitario: '',
  telefono: '',
  username: '',
  email: '',
  user: '',
  cargoId: ''
})

const sweetAlert = useSweetAlert()
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const id = computed(() => route.params.id)
const cargos = ref<any[]>([])

onMounted(() => {
  $fetch('/api/cargo', {
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    if (Array.isArray(response)) {
      cargos.value = response.map(item => ({ title: item.nombre, value: item.id }))
    }
  })

  if (props.edit) {
    $fetch<ColaboradorResponse>('/api/colaborador/' + id.value, {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      colaboradorResponse.value = response
      colaboradorRequest.value = {
        nombres: response.nombres,
        apellidos: response.apellidos,
        numeroIdentificacion: response.numeroIdentificacion,
        codigoSanitario: response.codigoSanitario,
        telefono: response.telefono,
        username: response.username,
        email: response.email,
        user: response.user,
        cargoId: response.cargo.id
      }
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
    $fetch('/api/colaborador', {
      method: 'POST',
      body: colaboradorRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Colaborador registrado', 'El colaborador ha sido registrado correctamente')
            .then(() => router.push({ name: 'colaborador' }))
    }).catch(error => {
      if (error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      } else if (error.data.data.errors) {
        errors.value = error.data.data.errors
      }
    })
  } else {
    $fetch('/api/colaborador/' + id.value, {
      method: 'PUT',
      body: colaboradorRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Colaborador actualizado', 'El colaborador ha sido actualizado correctamente')
      .then(() => {
        router.push({ name: 'colaborador' })
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
  sweetAlert.confirmAlert('¿Estás seguro que deseas eliminar este colaborador?')
    .then((result) => {
      if (result.isConfirmed) {
        $fetch('/api/colaborador/' + id.value, {
          method: 'DELETE',
          headers: useRequestHeaders(['cookie']),
        }).then(() => {
          sweetAlert.successAlert('¡Eliminado!', 'El registro de colaborador ha sido eliminado.')
            .then(() => router.push({ name: 'colaborador' }))
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
  $fetch('/api/colaborador/' + id.value, {
    method: 'PATCH',
    headers: useRequestHeaders(['cookie']),
  }).then(() => {
    sweetAlert.successAlert('¡Habilitado!', 'El registro de colaborador ha sido habilitado.')
    .then(() => {
      router.push({ name: 'colaborador' })
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
    <button class="text-blue-500" @click="$router.back()">Administración de colaboradores</button>
    /
    <span v-if="edit">{{ colaboradorRequest?.nombres + ' ' + colaboradorRequest?.apellidos }}</span>
    <template v-else>Registrar colaborador</template>
    <span v-if="colaboradorResponse?.deletedAt != null" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
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
      <v-text-field v-model="colaboradorRequest.nombres" label="Nombres" variant="outlined" :error-messages="errors.nombres" @update:model-value="errors.nombres = ''"></v-text-field>
      <v-text-field v-model="colaboradorRequest.apellidos" label="Apellidos" variant="outlined" :error-messages="errors.apellidos" @update:model-value="errors.apellidos = ''"></v-text-field>

      <v-text-field v-model="colaboradorRequest.numeroIdentificacion" label="Cédula" variant="outlined" :error-messages="errors.numeroIdentificacion" @update:model-value="errors.numeroIdentificacion = ''"></v-text-field>
      <v-text-field v-model="colaboradorRequest.codigoSanitario" label="Código Sanitario" variant="outlined" :error-messages="errors.codigoSanitario" @update:model-value="errors.codigoSanitario = ''"></v-text-field>
      <v-select v-model="colaboradorRequest.cargoId" :items="cargos" label="Cargo" variant="outlined" :error-messages="errors.cargoId"></v-select>
      <v-text-field v-if="edit" v-model="colaboradorRequest.username" label="Usuario" variant="outlined" readonly></v-text-field>
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
      <v-text-field class="col-span-2" v-model="colaboradorRequest.email" label="Correo electrónico" variant="outlined" :error-messages="errors.email" @update:model-value="errors.email = ''"></v-text-field>
      <v-text-field v-model="colaboradorRequest.telefono" label="Teléfono" variant="outlined" :error-messages="errors.telefono"  @update:model-value="errors.telefono = ''"></v-text-field>
    </div>

    <div class="flex justify-between mt-2">
      <button v-if="edit && colaboradorResponse?.deletedAt" class="font-semibold text-sm text-white bg-green-600 rounded-md hover:shadow-lg px-3 py-2" @click="onEnableHandler">Habilitar</button>
      <button v-else-if="edit" class="font-semibold text-sm text-white bg-red-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onDeleteHandler">Eliminar</button>
      <button v-else class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2" @click="$router.back()">Cancelar</button>
      <button class="font-semibold text-sm text-white bg-blue-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onClickHandle">Guardar</button>
    </div>
  </div>
</template>
