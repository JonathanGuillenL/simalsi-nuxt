<script setup lang="ts">
// import { ZoomImg } from 'vue3-zoomer'

defineProps<{
    imageUrl: string,
    open: boolean,
}>()

const model = defineModel()

const emit = defineEmits(['toggle'])
</script>

<template>
    <teleport to="body">
        <div v-if="open && imageUrl" class="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
            <div class="bg-white border mx-auto max-w-5xl rounded-lg p-6 my-20">
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-2xl font-semibold">Agregar lamina</h1>
                </div>

                <div class="text-base text-neutral-600 mb-4">Información de pago a realizar</div>

                <div class="grid gap-y-8">
                    <img class="border-8" :src="imageUrl" zoom-type="drag" :zoom-scale="4" :step="1" />
                    <v-textarea v-model="model" label="Descripción" variant="outlined" readonly></v-textarea>
                </div>

                <div class="flex justify-between mt-2">
                    <button
                        @click="$emit('toggle')"
                        class="font-semibold text-sm text-white bg-red-500 rounded-md hover:shadow-lg px-3 py-2">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </teleport>
</template>
