<script setup lang="ts">
import useSweetAlert from '~/composables/useSweetAlert'
import { SimalsiRoles } from '~/constants/roles'

const props = defineProps({
  id: String,
  edit: Boolean
})

const procedimientoResponse = ref<ProcedimientoQuirurgicoResponse | null>(null)
const procedimientoRequest = ref<ProcedimientoQuirurgicoRequest>({
  descripcion: '',
  regionAnatomicaId: null,
})

const errors = ref({
  descripcion: '',
  regionAnatomicaId: '',
})

const sweetAlert = useSweetAlert()
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const id = computed(() => route.params.id)

const regionesAnatomicas = ref<any>([])

onMounted(() => {
  $fetch('/api/region', {
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    if (Array.isArray(response)) {
      regionesAnatomicas.value = response.map(val => ({ title: val.descripcion, value: val.id }))
    }
  })

  if (props.edit) {
    $fetch<ProcedimientoQuirurgicoResponse>('/api/procedimiento/' + id.value, {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      procedimientoResponse.value = response
      procedimientoRequest.value = {
        descripcion: response.descripcion,
        regionAnatomicaId: response.regionAnatomica.id
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
    $fetch('/api/procedimiento', {
      method: 'POST',
      body: procedimientoRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Procedimiento quirúrgico registrado', 'El procedimiento quirúrgico ha sido registrado correctamente')
            .then(() => router.push({ name: 'procedimiento' }))
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      } else {
        errors.value = error.data.data.errors
      }
    })
  } else {
    $fetch('/api/procedimiento/' + id.value, {
      method: 'PUT',
      body: procedimientoRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Procedimiento quirúrgico actualizado', 'El procedimiento quirúrgico ha sido actualizado correctamente')
      .then(() => {
        router.push({ name: 'procedimiento' })
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
</script>

<template>
  <div class="font-semibold text-xl text-stone-700 pt-8 px-10">
    <button class="text-blue-500" @click="$router.back()">Administración de procedimientos quirúrgicos</button>
    /
    <span v-if="edit">{{ procedimientoRequest.descripcion }}</span>
    <template v-else>Registrar region anátomica</template>
    <span v-if="procedimientoResponse?.deletedAt != null" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
  </div>

  <div class="bg-white rounded border shadow-lg p-6 m-6">
    <div v-if="edit && loading" class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 animate-pulse">
      <div class="col-span-2 space-y-2 my-3">
        <div class="bg-gray-200 w-20 h-3 rounded-lg"></div>
        <div class="bg-gray-200 h-8 rounded-lg"></div>
      </div>
      <div class="col-span-2 space-y-2 my-3">
        <div class="bg-gray-200 w-20 h-3 rounded-lg"></div>
        <div class="bg-gray-200 h-8 rounded-lg"></div>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
      <v-text-field class="col-span-2" v-model="procedimientoRequest.descripcion" label="Descripción" variant="outlined" :error-messages="errors.descripcion" @update:model-value="errors.descripcion = ''"></v-text-field>
      <VAutocomplete class="col-span-2" v-model="procedimientoRequest.regionAnatomicaId" :items="regionesAnatomicas" label="Region anátomica" prepend-icon="" variant="outlined" clearable :error-messages="errors.regionAnatomicaId" @update:model-value="errors.regionAnatomicaId = '';"></VAutocomplete>
    </div>

    <div class="flex justify-between mt-2">
      <button v-if="!edit" class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2" @click="$router.back()">Cancelar</button>
      <div v-else></div>
      <AuthState>
        <template #default="{ user }">
          <button v-if="user?.roles?.includes(SimalsiRoles.ROLE_ADMIN)" class="font-semibold text-sm text-white bg-blue-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onClickHandle">Guardar</button>
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
