<script setup lang="ts">
import useSweetAlert from '~/composables/useSweetAlert'

const props = defineProps({
  id: String,
  edit: Boolean
})

const regionResponse = ref<RegionAnatomicaResponse | null>(null)
const regionRequest = ref<RegionAnatomicaRequest>({
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
    $fetch<RegionAnatomicaResponse>('/api/region/' + id.value, {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      regionResponse.value = response
      regionRequest.value = response
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
    $fetch('/api/region', {
      method: 'POST',
      body: regionRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Region anatómica registrada', 'La region anatómica ha sido registrada correctamente')
            .then(() => router.push({ name: 'region' }))
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      } else {
        errors.value = error.data.data.errors
      }
    })
  } else {
    $fetch('/api/region/' + id.value, {
      method: 'PUT',
      body: regionRequest.value,
      headers: useRequestHeaders(['cookie']),
    }).then(() => {
      sweetAlert.successAlert('Region anatómica actualizada', 'La region anatómica ha sido actualizada correctamente')
      .then(() => {
        router.push({ name: 'region' })
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
    <button class="text-blue-500" @click="$router.back()">Administración de regiones anatómicas</button>
    /
    <span v-if="edit">{{ regionRequest.descripcion }}</span>
    <template v-else>Registrar region anátomica</template>
    <span v-if="regionResponse?.deletedAt != null" class="text-xs bg-red-500 text-white font-semibold rounded-xl py-1 px-2 mx-2">Inactivo</span>
  </div>

  <div class="bg-white rounded border shadow-lg p-6 m-6">
    <div v-if="edit && loading" class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 animate-pulse">
      <div class="col-span-2 space-y-2 my-3">
        <div class="bg-gray-200 w-20 h-3 rounded-lg"></div>
        <div class="bg-gray-200 h-8 rounded-lg"></div>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">
      <v-text-field class="col-span-2" v-model="regionRequest.descripcion" label="Descripción" variant="outlined" :error-messages="errors.descripcion" @update:model-value="errors.descripcion = ''"></v-text-field>
    </div>

    <div class="flex justify-between mt-2">
      <button v-if="!edit" class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2" @click="$router.back()">Cancelar</button>
      <div v-else></div>
      <button class="font-semibold text-sm text-white bg-blue-500 disabled:bg-gray-400 disabled:shadow-none  rounded-md hover:shadow-lg px-3 py-2" :disabled="edit && loading" @click="onClickHandle">Guardar</button>
    </div>
  </div>
</template>
