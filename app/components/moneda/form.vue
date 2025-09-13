<script setup lang="ts">
import useSweetAlert from '~/composables/useSweetAlert'

const props = defineProps({
  id: String,
  edit: Boolean
})

const monedaResponse = ref<MonedaResponse | null>(null)
const monedaRequest = ref<MonedaRequest>({
  descripcion: '',
  tipoCambio: null,
  signoMonetario: ''
})

const errors = ref({
  descripcion: '',
  tipoCambio: '',
  signoMonetario: ''
})

const sweetAlert = useSweetAlert()
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const id = computed(() => route.params.id)

onMounted(() => {
  if (props.edit) {
    $fetch<MonedaResponse>('/api/moneda/' + id.value, {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      monedaResponse.value = response
      monedaRequest.value = response
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
    $fetch('/api/moneda', {
      method: 'POST',
      body: monedaRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Moneda registrada', 'La moneda ha sido registrada correctamente')
            .then(() => router.push({ name: 'moneda' }))
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      } else {
        errors.value = error.data.data.errors
      }
    })
  } else {
    $fetch('/api/moneda/' + id.value, {
      method: 'PUT',
      body: monedaRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Moneda actualizada', 'La moneda ha sido actualizada correctamente')
      .then(() => {
        router.push({ name: 'moneda' })
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
  sweetAlert.confirmAlert('¿Estás seguro que deseas eliminar esta moneda?')
    .then((result) => {
      if (result.isConfirmed) {
        $fetch('/api/moneda/' + id.value, {
          method: 'DELETE',
          headers: useRequestHeaders(['cookie']),
        }).then(() => {
          sweetAlert.successAlert('¡Eliminado!', 'El registro de moneda ha sido eliminado.')
            .then(() => router.push({ name: 'moneda' }))
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
  $fetch('/api/moneda/' + id.value, {
    method: 'PATCH',
    headers: useRequestHeaders(['cookie']),
  }).then(() => {
    sweetAlert.successAlert('¡Habilitado!', 'El registro de moneda ha sido habilitado.')
    .then(() => {
      router.push({ name: 'moneda' })
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
    <button class="text-blue-500" @click="$router.back()">Administración de monedas</button>
    /
    <span v-if="edit">{{ monedaRequest.descripcion }}</span>
    <template v-else>Registrar moneda</template>
    <span v-if="monedaResponse?.deletedAt != null" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
  </div>

  <div class="bg-white rounded border shadow-lg p-6 m-6">
    <div v-if="edit && loading" class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 animate-pulse">
      <div class="col-span-2 space-y-2 my-3">
        <div class="bg-gray-200 w-20 h-3 rounded-lg"></div>
        <div class="bg-gray-200 h-8 rounded-lg"></div>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
      <v-text-field class="col-span-2" v-model="monedaRequest.descripcion" label="Descripción" variant="outlined" :error-messages="errors.descripcion" @update:model-value="errors.descripcion = ''"></v-text-field>
      <money-field v-model="monedaRequest.tipoCambio" label="Tipo de Cambio" variant="outlined" :error-messages="errors.tipoCambio" @update:model-value="errors.tipoCambio = ''"></money-field>
      <v-text-field v-model="monedaRequest.signoMonetario" label="Signo Monetario" variant="outlined" :error-messages="errors.signoMonetario" @update:model-value="errors.signoMonetario = ''"></v-text-field>
    </div>

    <div class="flex justify-between mt-2">
      <button v-if="edit && monedaResponse?.deletedAt" class="font-semibold text-sm text-white bg-green-600 rounded-md hover:shadow-lg px-3 py-2" @click="onEnableHandler">Habilitar</button>
      <button v-else-if="edit" class="font-semibold text-sm text-white bg-red-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onDeleteHandler">Eliminar</button>
      <button v-else class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2" @click="$router.back()">Cancelar</button>
      <button class="font-semibold text-sm text-white bg-blue-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onClickHandle">Guardar</button>
    </div>
  </div>
</template>
