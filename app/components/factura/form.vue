<script setup lang="ts">
const modalCliente = ref(false)
const clienteNombre = computed(() => {
  if (cliente.value && cliente.value.persona && cliente.value.persona.apellido) {
    return cliente.value.persona.nombre + ' ' + cliente.value.persona.apellido
  }
  return cliente.value?.persona?.nombre || ''
})
const cliente = ref<ClientePageResponse | null>(null)

const modalSolicitudes = ref(false)
const solicitudes = ref<SolicitudPageResponse[]>([])

const modalDescuentos = ref(false)
const descuentos = ref<DescuentoPageResponse[]>([])

const agregarPago = ref(false)
const monedas = ref<any[]>([])
const metodoPago = ref<any[]>([])
const sweetAlert = useSweetAlert()
const router = useRouter()

const factura = ref<FacturaRequest>({
    clienteId: null,
    descuentos: [],
    detalle: [],
    pago: null
})

const errors = ref({
    monto: '',
    metodoPagoId: '',
    monedaId: '',
    clienteId: '',
})

const subtotal = computed(() => {
    let _subtotal = 0
    solicitudes.value.forEach(item => {
        _subtotal += item.precio
    })

    return _subtotal
})

const descuentoTotal = computed(() => {
    let _descuento = 0
    descuentos.value.forEach(item => {
        _descuento += item.porcentaje
    })

    return _descuento > 0? _descuento / 100 : 0
})

const moneda = computed(() => {
    const val = monedas.value.find(item => item.value == factura.value.pago.monedaId)

    if (val) {
        return val
    }

    return { signoMonetario: '', tipoCambio: 0 }
})

const conversion = computed(() => {
    if (moneda.value && factura.value.pago.monto) {
        return moneda.value.tipoCambio * factura.value.pago.monto
    }

    return 0;
})

onMounted(async () => {
    $fetch('/api/moneda', {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      if (Array.isArray(response)) {
        monedas.value = response.map(item => ({
            title: item.descripcion,
            value: item.id,
            signoMonetario: item.signoMonetario,
            tipoCambio: item.tipoCambio
        }))
      }
    })

    $fetch('/api/metodo', {
      headers: useRequestHeaders(['cookie']),
    }).then(response => {
      if (Array.isArray(response)) {
        metodoPago.value = response.map(item => ({ title: item.descripcion, value: item.id }))
      }
    })
})

function actualizarCliente(clienteResponse: ClientePageResponse) {
  cliente.value = clienteResponse
}

function settearPago() {
    if (!agregarPago.value) {
        factura.value.pago = null
    } else {
        factura.value.pago = {
            observaciones: '',
            referencia: '',
            metodoPagoId: null,
            monedaId: null,
            monto: null
        }
    }
}

function handleGuardar() {
  factura.value.detalle = solicitudes.value.map(solicitud => solicitud.id)
  factura.value.descuentos = descuentos.value.map(descuento => descuento.id)

  $fetch('/api/factura', {
    method: 'POST',
    body: factura.value,
    headers: useRequestHeaders(['cookie']),
  }).then(() => {
    sweetAlert.successAlert('Factura registrada', 'La factura ha sido registrada correctamente')
          .then(() => router.push({ name: 'factura' }))
  }).catch(error => {
    if (!error.data.data.errors && error.data.data.error) {
      sweetAlert.errorAlert(error.data.data.error)
    } else {
      errors.value = error.data.data.errors
    }
  })
}
</script>

<template>
  <div class="font-semibold text-xl text-stone-700 pt-8 px-10">
    <NuxtLink class="text-blue-500" :to="{ name: 'factura' }">Administración de facturas</NuxtLink>
    /Registrar factura
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 m-6">
    <div class="overflow-y-auto space-y-5">
      <div class="bg-white rounded border overflow-hidden shadow-lg">
        <div class="flex items-center justify-between bg-sky-800 mb-2 px-6 pt-6 pb-3">
          <h1 class="text-2xl text-white font-semibold">Buscar Cliente (<span class="text-red-500">*</span>)</h1>
        </div>

        <div class="px-6 pt-3 pb-6">
          <div class="text-base text-neutral-600 mb-4">Seleccione el cliente al cual se le va a facturar</div>

          <div class="flex justify-between items-start space-x-5">
            <div class="w-2/3">
              <v-text-field :model-value="clienteNombre" label="Cliente" variant="outlined" density="compact" :error-messages="errors.clienteId" :readonly="true"></v-text-field>
            </div>
            <button @click="modalCliente = true" class="font-semibold text-sm text-white bg-blue-600 rounded-md hover:shadow-lg w-1/3 px-3 py-2"
            >
              Seleccionar cliente
            </button>
            <ClienteModal :open="modalCliente" v-model="factura.clienteId" @selected="actualizarCliente" @toggle="modalCliente = !modalCliente" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded border overflow-hidden shadow-lg">
        <div class="flex items-center justify-between bg-sky-800 mb-2 px-6 pt-6 pb-3">
            <h1 class="text-2xl text-white font-semibold">Servicios (<span class="text-red-500">*</span>)</h1>
        </div>

        <div class="px-6 pt-3 pb-6">
          <table v-show="solicitudes.length > 0" class="w-full">
            <thead class="text-left">
              <tr>
                <th class="font-normal w-1/6">ID</th>
                <th class="font-normal w-2/6">Servicio</th>
                <th class="font-normal w-2/6">Precio</th>
                <th class="font-normal w-1/6">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in solicitudes" :key="item.id">
                <td class="pr-3 py-2">
                  <input class="block bg-slate-100 rounded-lg w-full px-3 py-2" :value="item.id" type="text" name="" id="">
                </td>
                <td class="pr-3 py-2">
                  <input class="block bg-slate-100 rounded-lg w-full px-3 py-2" :value="item.servicio" type="text" name="" id="">
                </td>
                <td class="pr-3 py-2">
                  <input class="block bg-slate-100 rounded-lg w-full px-3 py-2" :value="'C$ ' + item.precio.toFixed(2)" type="text" name="" id="">
                </td>
                <td class="pr-3 py-2">
                  <button @click="() => {
                    const index = solicitudes.indexOf(item)

                    if (index !== -1) {
                      solicitudes.splice(index, 1)
                    }
                  }" class="font-semibold text-sm text-white bg-red-400 rounded-md hover:shadow-lg px-3 py-2">X</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-end mt-5">
            <button class="text-blue-500 font-semibold border border-solid border-blue-500 rounded-lg px-3 py-2"
              @click="modalSolicitudes = true"
            >
              + Añadir servicio
            </button>
            <SolicitudModal :open="modalSolicitudes" v-model="solicitudes" :cliente-id="cliente?.id" @toggle="modalSolicitudes = !modalSolicitudes" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded border overflow-hidden shadow-lg">
          <div class="flex items-center justify-between bg-sky-800 mb-2 px-6 pt-6 pb-3">
              <h1 class="text-2xl text-white font-semibold">Descuentos (<span class="text-red-500">*</span>)</h1>
          </div>

          <div class="px-6 pt-3 pb-6">
              <div class="text-base text-neutral-600 mb-4">seleccione los descuentos a aplicar a esta factura</div>

              <table v-show="descuentos.length > 0" class="w-full">
                  <thead class="text-left">
                      <tr>
                          <th class="font-normal w-3/5">Descripción</th>
                          <th class="font-normal w-1/5">Porcentaje</th>
                          <th class="font-normal w-1/5">Acciones</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="item in descuentos" :key="item.id">
                          <td class="pr-3 py-2">
                              <input class="block bg-slate-100 rounded-lg w-full px-3 py-2" :value="item.descripcion" type="text" name="" id="">
                          </td>
                          <td class="pr-3 py-2">
                              <input class="block bg-slate-100 rounded-lg w-full px-3 py-2" :value="item.porcentaje.toFixed(2) + '%'" type="text" name="" id="">
                          </td>
                          <td class="pr-3 py-2">
                              <button @click="() => {
                                  const index = descuentos.indexOf(item)

                                  if (index !== -1) {
                                      descuentos.splice(index, 1)
                                  }
                              }" class="font-semibold text-sm text-white bg-red-400 rounded-md hover:shadow-lg px-3 py-2">X</button>
                          </td>
                      </tr>
                  </tbody>
              </table>
              <div class="flex justify-end mt-5">
                  <button class="text-blue-500 font-semibold border border-solid border-blue-500 rounded-lg px-3 py-2"
                      @click="modalDescuentos = true"
                  >
                      + Añadir descuento
                  </button>
                  <DescuentoModal :open="modalDescuentos" v-model="descuentos" @toggle="modalDescuentos = !modalDescuentos" />
              </div>
          </div>
      </div>

      <div class="bg-white rounded border shadow-lg p-6">
          <div class="flex items-center justify-between mb-2">
              <h1 class="text-2xl font-semibold">Información de pago</h1>
              <v-switch
                  color="primary"
                  value="primary"
                  v-model="agregarPago"
                  label="¿Agregar pago?"
                  @update:model-value="settearPago"
                  hide-details
              ></v-switch>
          </div>

          <template v-if="agregarPago && factura.pago">
              <div class="text-base text-neutral-600 mb-4">Información de pago a realizar</div>

              <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                  <v-select label="Moneda" :items="monedas" v-model="factura.pago.monedaId" variant="outlined" density="compact" :error-messages="errors.monedaId"></v-select>

                  <money-field label="Monto" variant="outlined" v-model="factura.pago.monto" :signo-monetario="moneda.signoMonetario" density="compact" :error-messages="errors.monto"></money-field>

                  <money-field label="Tipo de cambio" v-model:model-value="moneda.tipoCambio" variant="outlined" density="compact" :disabled="true"></money-field>

                  <money-field label="Conversión" variant="outlined" v-model:model-value="conversion" density="compact" :disabled="true"></money-field>

                  <v-select class="col-span-2" label="Metodo de pago" v-model="factura.pago.metodoPagoId" :items="metodoPago" variant="outlined" density="compact" :error-messages="errors.metodoPagoId"></v-select>

                  <v-textarea class="col-span-2" label="Observaciones" variant="outlined" density="compact"></v-textarea>
              </div>
          </template>
      </div>
    </div>

  <div class="sticky top-20 bg-white rounded border shadow-lg space-y-5 h-fit p-6">
    <h1 class="text-2xl font-semibold">Resumen</h1>

    <div>
      <div class="flex items-center space-x-1 mb-2">
        <h1 class="text-lg font-semibold">Información del cliente</h1>
        <div v-if="cliente?.tipoCliente == 'CLIENTE_ESPONTANEO'" class="text-xs bg-lime-500 text-white font-semibold rounded-xl py-1 px-2">Cliente espontáneo</div>
        <div v-else-if="cliente?.tipoCliente == 'MEDICO_AFILIADO'" class="text-xs bg-orange-500 text-white font-semibold rounded-xl py-1 px-2">Médico afiliado</div>
        <div v-else-if="cliente?.tipoCliente == 'CLINICA_AFILIADA'" class="text-xs bg-indigo-500 text-white font-semibold rounded-xl py-1 px-2">Clínica afiliada</div>
      </div>

        <div class="grid grid-cols-2 gap-x-4 gap-y-3">
            <div class="col-span-2">
                <input :value="clienteNombre" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" name="" id="">
            </div>
            <div>
                <label for="" class="">Telefono</label>
                <input :value="cliente?.persona?.telefono" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" :readonly="true" id="">
            </div>
            <div>
                <label for="" class="">Dirección</label>
                <input :value="cliente?.persona?.direccion" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text" :readonly="true" id="">
            </div>
        </div>
    </div>

    <div>
        <div class="flex items-center justify-between mb-2">
            <h1 class="text-lg font-semibold">Detalle de factura</h1>
        </div>

        <table class="w-full">
            <thead class="text-left">
                <tr>
                    <th class="font-normal w-2/6">Servicio</th>
                    <th class="font-normal w-2/6">Paciente</th>
                    <th class="font-normal w-1/6">Precio</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in solicitudes" :key="item.id">
                    <td class="pr-3 py-2">
                        <input class="block bg-slate-100 rounded-lg w-full px-3 py-2" :value="item.servicio" type="text" name="" id="">
                    </td>
                    <td class="pr-3 py-2">
                        <input class="block bg-slate-100 rounded-lg w-full px-3 py-2" :value="item.paciente" type="text" name="" id="">
                    </td>
                    <td class="pr-3 py-2">
                        <input class="block bg-slate-100 rounded-lg w-full px-3 py-2" :value="item.precio.toFixed(2)" type="text" name="" id="">
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td class="py-1">
                        <div class="col-span-2 font-semibold">Subtotal</div>
                    </td>
                    <td class="text-right px-3">
                        <div class="">C$ {{ subtotal.toFixed(2) }}</div>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td class="py-1">
                        <div class="col-span-2 font-semibold">Descuento</div>
                    </td>
                    <td class="text-right px-3">
                        <div class="">- C$ {{ (subtotal * descuentoTotal).toFixed(2) }}</div>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td class="py-1">
                        <div class="col-span-2 font-semibold">Total</div>
                    </td>
                    <td class="text-right px-3">
                        <div class="">C$ {{ (subtotal - (subtotal * descuentoTotal)).toFixed(2) }}</div>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="flex justify-end mt-5">
            <button
                class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2"
                @click="handleGuardar"
            >
                Crear factura
            </button>
        </div>
    </div>
  </div>
  </div>
</template>
