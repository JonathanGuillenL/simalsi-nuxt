<script setup lang="ts">
import useSweetAlert from '~/composables/useSweetAlert'

const props = defineProps({
  id: String,
  edit: Boolean
})

const metodoResponse = ref<MetodoPagoResponse | null>(null)
const metodoRequest = ref<MetodoPagoRequest>({
  descripcion: '',
})

const errors = ref({
  descripcion: '',
})

const sweetAlert = useSweetAlert()
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const id = computed(() => route.params.id)

onMounted(() => {
  if (props.edit) {
    $fetch<MetodoPagoResponse>('/api/metodo/' + id.value, {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      metodoResponse.value = response
      metodoRequest.value = response
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
    $fetch('/api/metodo', {
      method: 'POST',
      body: metodoRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Método de pago registrado', 'El método de pago ha sido registrado correctamente')
            .then(() => router.push({ name: 'metodo-pago' }))
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      } else {
        errors.value = error.data.data.errors
      }
    })
  } else {
    $fetch('/api/metodo/' + id.value, {
      method: 'PUT',
      body: metodoRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Método de pago actualizado', 'El método de pago ha sido actualizado correctamente')
      .then(() => {
        router.push({ name: 'metodo-pago' })
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
  sweetAlert.confirmAlert('¿Estás seguro que deseas eliminar este método de pago?')
    .then((result) => {
      if (result.isConfirmed) {
        $fetch('/api/metodo/' + id.value, {
          method: 'DELETE',
          headers: useRequestHeaders(['cookie']),
        }).then(() => {
          sweetAlert.successAlert('¡Eliminado!', 'El registro de método de pago ha sido eliminado.')
            .then(() => router.push({ name: 'metodo-pago' }))
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
  $fetch('/api/metodo/' + id.value, {
    method: 'PATCH',
    headers: useRequestHeaders(['cookie']),
  }).then(() => {
    sweetAlert.successAlert('¡Habilitado!', 'El registro de método de pago ha sido habilitado.')
    .then(() => {
      router.push({ name: 'metodo-pago' })
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
    <button class="text-blue-500" @click="$router.back()">Administración de métodos de pago</button>
    /
    <span v-if="edit">{{ metodoRequest.descripcion }}</span>
    <template v-else>Registrar método de pago</template>
    <span v-if="metodoResponse?.deletedAt != null" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
  </div>

  <div class="bg-white rounded border shadow-lg p-6 m-6">
    <div v-if="edit && loading" class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 animate-pulse">
      <div class="col-span-2 space-y-2 my-3">
        <div class="bg-gray-200 w-20 h-3 rounded-lg"></div>
        <div class="bg-gray-200 h-8 rounded-lg"></div>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
      <v-text-field class="col-span-2" v-model="metodoRequest.descripcion" label="Descripción" variant="outlined" :error-messages="errors.descripcion" @update:model-value="errors.descripcion = ''"></v-text-field>
    </div>

    <div class="flex justify-between mt-2">
      <button v-if="edit && metodoResponse?.deletedAt" class="font-semibold text-sm text-white bg-green-600 rounded-md hover:shadow-lg px-3 py-2" @click="onEnableHandler">Habilitar</button>
      <button v-else-if="edit" class="font-semibold text-sm text-white bg-red-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onDeleteHandler">Eliminar</button>
      <button v-else class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2" @click="$router.back()">Cancelar</button>
      <button class="font-semibold text-sm text-white bg-blue-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onClickHandle">Guardar</button>
    </div>
  </div>
</template>
