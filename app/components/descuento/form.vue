<script setup lang="ts">
import useSweetAlert from '~/composables/useSweetAlert'

const props = defineProps({
  id: String,
  edit: Boolean
})

const descuentoResponse = ref<DescuentoPageResponse | null>(null)
const descuentoRequest = ref<DescuentoRequest>({
  descripcion: '',
  porcentaje: null,
  fechaInicio: null,
  fechaFin: null,
  anual: false,
  automatico: false
})

const errors = ref({
  descripcion: '',
  porcentaje: '',
  fechaInicio: '',
  fechaFin: '',
  anual: '',
  automatico: ''
})

const sweetAlert = useSweetAlert()
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const id = computed(() => route.params.id)

onMounted(() => {
  if (props.edit) {
    $fetch<DescuentoPageResponse>('/api/descuento/' + id.value, {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      descuentoResponse.value = response
      descuentoRequest.value = descuentoResponse.value
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
    $fetch('/api/descuento', {
      method: 'POST',
      body: descuentoRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Descuento registrado', 'El descuento ha sido registrado correctamente')
            .then(() => router.push({ name: 'descuento' }))
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      } else {
        errors.value = error.data.data.errors
      }
    })
  } else {
    $fetch('/api/descuento/' + id.value, {
      method: 'PUT',
      body: descuentoRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Descuento actualizado', 'El descuento ha sido actualizado correctamente')
      .then(() => {
        router.push({ name: 'descuento' })
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
  sweetAlert.confirmAlert('¿Estás seguro que deseas eliminar este descuento?')
    .then((result) => {
      if (result.isConfirmed) {
        $fetch('/api/descuento/' + id.value, {
          method: 'DELETE',
          headers: useRequestHeaders(['cookie']),
        }).then(() => {
          sweetAlert.successAlert('¡Eliminado!', 'El registro de descuento ha sido eliminado.')
            .then(() => router.push({ name: 'descuento' }))
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
  $fetch('/api/descuento/' + id.value, {
    method: 'PATCH',
    headers: useRequestHeaders(['cookie']),
  }).then(() => {
    sweetAlert.successAlert('¡Habilitado!', 'El registro de descuento ha sido habilitado.')
    .then(() => {
      router.push({ name: 'descuento' })
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
    <button class="text-blue-500" @click="$router.back()">Administración de descuentos</button>
    /
    <span v-if="edit">{{ descuentoRequest?.descripcion }}</span>
    <template v-else>Registrar descuento</template>
    <span v-if="descuentoResponse?.deletedAt != null" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
  </div>

  <div class="bg-white rounded border shadow-lg p-6 m-6">
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
      <v-text-field v-model="descuentoRequest.descripcion" label="Descripción" variant="outlined" :error-messages="errors.descripcion"></v-text-field>
      <v-text-field v-model="descuentoRequest.porcentaje" label="Porcentaje" variant="outlined" :error-messages="errors.porcentaje"></v-text-field>

      <v-date-input v-model="descuentoRequest.fechaInicio" label="Fecha de inicio" prepend-icon="" variant="outlined" :error-messages="errors.fechaInicio"></v-date-input>
      <v-date-input v-model="descuentoRequest.fechaFin" label="Fecha de fin" prepend-icon="" variant="outlined" :error-messages="errors.fechaFin"></v-date-input>

      <div class="flex space-x-20 col-span-2 md:col-span-1">
          <v-checkbox v-model="descuentoRequest.anual" label="Anual" type="checkbox" variant="outlined" :error-messages="errors.anual"></v-checkbox>
          <v-checkbox v-model="descuentoRequest.automatico" label="Automático" type="checkbox" variant="outlined" :error-messages="errors.automatico"></v-checkbox>
      </div>
    </div>

    <div class="flex justify-between mt-2">
      <button v-if="edit && descuentoResponse?.deletedAt" class="font-semibold text-sm text-white bg-green-600 rounded-md hover:shadow-lg px-3 py-2" @click="onEnableHandler">Habilitar</button>
      <button v-else-if="edit" class="font-semibold text-sm text-white bg-red-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onDeleteHandler">Eliminar</button>
      <button v-else class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2" @click="$router.back()">Cancelar</button>
      <button class="font-semibold text-sm text-white bg-blue-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onClickHandle">Guardar</button>
    </div>
  </div>
</template>
