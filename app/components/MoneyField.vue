<script lang="ts" setup>
const props = defineProps<{
    signoMonetario?: string,
    modelValue: number | null,
    errorMessages?: string | null,
    label: string,
    class?: string
}>()

const emit = defineEmits(['update:modelValue']);

const montoSolicitadoComputed = computed({
  get() {
    const formatter = new Intl.NumberFormat('es-NI', {
        style: 'currency',
        currency: 'NIO',
    });

    if (props.modelValue) {
      const parts = formatter.formatToParts(props.modelValue);

      const result = parts.map(part => {
        if (part.type === 'currency' && props.signoMonetario) {
          return props.signoMonetario;
        }
        return part.value;
      }).join('');

      return result
    }

    return '';
  },
  set(newValue) {
    newValue = newValue.replace(/[^0-9-]/g, '')
    const numberValue = Number.parseFloat(newValue) / 100
    emit('update:modelValue', isNaN(numberValue) ? 0 : numberValue)
  }
})
</script>

<template>
  <v-text-field
    v-model="montoSolicitadoComputed"
    :class="props.class"
    :label="props.label"
    type="text"
    variant="outlined"
    :error-messages="props.errorMessages"
  ></v-text-field>
</template>
