<script setup lang="ts">
defineProps<{
    open: boolean,
    notCliente: boolean
}>()

const model = defineModel<number | null>()

const emit = defineEmits(['toggle','selected'])
const router = useRouter()

function handleSeleccionar(item: any) {
  model.value = item.id
  emit('selected', item)
  toggleHandler()
}

function toggleHandler() {
  router.push('')
  emit('toggle')
}
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div class="bg-white border mx-auto max-w-5xl rounded-lg p-6 my-20">
        <div class="flex justify-between items-center border-b mb-5">
          <div class="font-semibold text-xl">Seleccione un paciente</div>
          <button @click="toggleHandler" class="flex justify-center items-center hover:bg-gray-100 rounded p-2 m-1">
            <v-icon icon="fa fa-x" size="x-small"></v-icon>
          </button>
        </div>
        <PacienteTable :not-cliente="notCliente" :register="false" :selector="true" @select="handleSeleccionar" />
      </div>
    </div>
  </teleport>
</template>
