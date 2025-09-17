<script setup lang="ts">
const props = defineProps<{
    open: boolean,
    id: number
}>()

const model = defineModel<AdjuntarArchivoResponse[]>()

const archivo = ref<File | File[] | null>(null)
const descripcion = ref('')

const imageUrl = ref<string[]>([])
const carousel = ref<number>(0)
const sweetAlert = useSweetAlert()

const emit = defineEmits(['toggle'])

function createImage(file: File) {
    const reader = new FileReader();

    reader.onload = e => {
        if (e.target && e.target.result) {
            imageUrl.value.push(e.target.result as string)
        }
    }
    reader.readAsDataURL(file);
}

function onFileChanged(file: File | File[]) {
    if (!file) {
        imageUrl.value = []
        return;
    }

    imageUrl.value = []

    if (Array.isArray(file)) {
        file.forEach(f => createImage(f))
    } else {
        createImage(file)
    }
    carousel.value = 0
}

async function handleAgregar() {
  if (archivo.value) {
    const formData = new FormData()

    if (!Array.isArray(archivo.value)) {
      console.log(archivo.value)
        formData.append("file", archivo.value)
        formData.append("filename", archivo.value.name)
        formData.append("mimetype", archivo.value.type)
        formData.append("descripcion", descripcion.value)
    }

    $fetch<AdjuntarArchivoResponse>('/api/resultado/upload/' + props.id, {
      method: 'POST',
      body: formData,
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      sweetAlert.successAlert('Archivo registrado', 'El archivo ha sido registrado correctamente')
            .then(() => model.value?.push(response))
      emit("toggle")
    }).catch(error => {
      if (!error.data.data.errors && error.data.data.error) {
        sweetAlert.errorAlert(error.data.data.error)
      }
    })
  }
}
</script>

<template>
    <teleport to="body">
        <div v-if="open" class="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
            <div class="bg-white border mx-auto max-w-5xl rounded-lg p-6 my-20">
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-2xl font-semibold">Adjuntar imagen</h1>
                </div>

                <div class="text-base text-neutral-600 mb-4"></div>

                <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                    <v-file-input v-model="archivo" class="col-span-2" @update:modelValue="onFileChanged" label="Archivo" variant="outlined" accept="image/*" chips></v-file-input>
                    <v-textarea v-model="descripcion" class="col-span-2" label="Descripción" variant="outlined"></v-textarea>

                    <v-img v-for="image in imageUrl" :src="image" class="col-span-2" :height="400"></v-img>
                </div>

                <div class="flex justify-between mt-2">
                    <button
                        @click="$emit('toggle')"
                        class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2">
                        Cancelar
                    </button>
                    <button
                        @click="handleAgregar"
                        class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2">
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    </teleport>
</template>
