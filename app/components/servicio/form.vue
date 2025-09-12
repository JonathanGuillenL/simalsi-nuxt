<script setup lang="ts">
import useSweetAlert from '~/composables/useSweetAlert'

const props = defineProps({
  id: String,
  edit: Boolean
})

const servicioResponse = ref<ServicioPageResponse | null>(null)
const servicioRequest = ref<ServicioCreateRequest>({
  descripcion: '',
  precio: null,
  regionAnatomicaId: null,
  procedimientoId: null
})

const errors = ref({
  descripcion: '',
  precio: '',
  regionAnatomicaId: '',
  procedimientoId: ''
})

const sweetAlert = useSweetAlert()
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const id = computed(() => route.params.id)
const mount = ref(true)

const regionesAnatomicas = ref<any>([])
const procedimientos = ref<any>([])

onMounted(() => {
  $fetch('/api/region', {
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    if (Array.isArray(response)) {
      regionesAnatomicas.value = response.map(val => ({ title: val.descripcion, value: val.id }))
    }
  })

  if (props.edit) {
    $fetch<ServicioPageResponse>('/api/servicio/' + id.value, {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      servicioResponse.value = response
      servicioRequest.value = {
        descripcion: response.descripcion,
        precio: response.precio,
        regionAnatomicaId: response.procedimientoQuirurgico?.regionAnatomica?.id ?? null,
        procedimientoId: response.procedimientoQuirurgico?.id ?? null
      }
      loading.value = false
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      }
    })
  }
})

watch(() => servicioRequest.value.regionAnatomicaId, async () => {
  if (servicioRequest.value.regionAnatomicaId) {
    $fetch('/api/procedimiento/region/' + servicioRequest.value.regionAnatomicaId, {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      if (Array.isArray(response)) {
        procedimientos.value = response.map(val => ({ title: val.descripcion, value: val.id }))
      }
    })
    mount.value = false
  }
})

function onClickHandle() {
  if (!props.edit) {
    $fetch('/api/servicio', {
      method: 'POST',
      body: servicioRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Servicio registrado', 'El servicio ha sido registrado correctamente')
            .then(() => router.push({ name: 'servicio' }))
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      } else {
        errors.value = error.data.data.errors
      }
    })
  } else {
    $fetch('/api/servicio/' + id.value, {
      method: 'PUT',
      body: servicioRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Servicio actualizado', 'El servicio ha sido actualizado correctamente')
      .then(() => {
        router.push({ name: 'servicio' })
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
  sweetAlert.confirmAlert('¿Estás seguro que deseas eliminar este servicio?')
    .then((result) => {
      if (result.isConfirmed) {
        $fetch('/api/servicio/' + id.value, {
          method: 'DELETE',
          headers: useRequestHeaders(['cookie']),
        }).then(() => {
          sweetAlert.successAlert('¡Eliminado!', 'El registro de servicio ha sido eliminado.')
            .then(() => router.push({ name: 'servicio' }))
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
  $fetch('/api/servicio/' + id.value, {
    method: 'PATCH',
    headers: useRequestHeaders(['cookie']),
  }).then(() => {
    sweetAlert.successAlert('¡Habilitado!', 'El registro de servicio ha sido habilitado.')
    .then(() => {
      router.push({ name: 'servicio' })
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
    <button class="text-blue-500" @click="$router.back()">Administración de servicios</button>
    /
    <span v-if="edit">{{ servicioResponse?.descripcion }}</span>
    <template v-else>Registrar servicio</template>
    <span v-if="servicioResponse?.deletedAt != null" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
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
      <v-text-field v-model="servicioRequest.descripcion" label="Descripción" variant="outlined" :error-messages="errors.descripcion" @update:model-value="errors.descripcion = ''"></v-text-field>
      <money-field v-model="servicioRequest.precio" label="Precio" variant="outlined" :error-messages="errors.precio" @update:model-value="errors.descripcion = ''"></money-field>

      <VAutocomplete v-model="servicioRequest.regionAnatomicaId" :items="regionesAnatomicas" label="Región anatómica" prepend-icon="" variant="outlined" clearable :error-messages="errors.regionAnatomicaId" @update:model-value="errors.regionAnatomicaId = ''; servicioRequest.procedimientoId = null"></VAutocomplete>
      <VAutocomplete v-model="servicioRequest.procedimientoId" :items="procedimientos" label="Procedimiento quirúrgico" prepend-icon="" variant="outlined" clearable :error-messages="errors.procedimientoId" @update:model-value="errors.procedimientoId = ''"></VAutocomplete>
    </div>

    <div class="flex justify-between mt-2">
      <button v-if="edit && servicioResponse?.deletedAt" class="font-semibold text-sm text-white bg-green-600 rounded-md hover:shadow-lg px-3 py-2" @click="onEnableHandler">Habilitar</button>
      <button v-else-if="edit" class="font-semibold text-sm text-white bg-red-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onDeleteHandler">Eliminar</button>
      <button v-else class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2" @click="$router.back()">Cancelar</button>
      <button class="font-semibold text-sm text-white bg-blue-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onClickHandle">Guardar</button>
    </div>
  </div>
</template>
