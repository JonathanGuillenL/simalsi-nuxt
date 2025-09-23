<script setup lang="ts">
import { SimalsiRoles } from '~/constants/roles'

const facturaResponse = ref<any>(null)
const modalPago = ref(false)

const { isAuthorized } = useAuth()
const route = useRoute()
const loading = ref(true)
const sweetAlert = useSweetAlert()
const id = computed(() => Number(route.params.id ?? 0))

onMounted(() => {
  $fetch<any>('/api/factura/' + id.value, {
    headers: useRequestHeaders(['cookie']),
  }).then(response => {
    facturaResponse.value = response
    loading.value = false
  }).catch(error => {
    if (!error.data.data.errors && error.data.data.error) {
      sweetAlert.errorAlert(error.data.data.error)
    }
  })
})

function revertirPago(pagoId: number) {
  sweetAlert.confirmAlert('¿Estás seguro de que deseas revertir el pago?', '¡No podrás revertir este cambio!')
    .then((result) => {
      if (result.isConfirmed) {
        $fetch(`/api/factura/${id.value}/pago/${pagoId}`, {
          method: 'PUT',
          headers: useRequestHeaders(['cookie']),
        }).then(response => {
          facturaResponse.value = response
          sweetAlert.successAlert('Pago revertido exitosamente')
        }).catch(error => {
          if (!error.data.data.errors && error.data.data.error) {
            sweetAlert.errorAlert(error.data.data.error)
          }
        })
      }
    })
}

async function handlePdfClick(id: number) {
  const url = await $fetch<string>('/api/solicitud/pdf/' + id, {
    method: 'POST',
    headers: useRequestHeaders(['cookie', 'location']),
  })

  if (url) {
    window.open(url)
  }
}
</script>

<template>
<div class="font-semibold text-xl text-stone-700 pt-8 px-10">
        <router-link class="text-blue-500" :to="{ name: 'factura' }">Administración de facturas</router-link>
        /
        <span>N&ordm;{{ String(facturaResponse?.id).padStart(5, '0') }}</span>
    </div>

    <div class="bg-white rounded border shadow-lg p-6 m-6 space-y-5">

        <h1 class="text-lg font-semibold">Información de factura</h1>
        <div v-if="facturaResponse" class="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
                <label for="" class="">Número de factura</label>
                <input :value="String(facturaResponse?.id).padStart(5, '0')" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
            </div>
            <div>
                <label for="" class="">Fecha de facturación</label>
                <input :value="(new Date(facturaResponse.createdAt)).toLocaleString('es-CA')" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
            </div>
        </div>
        <div>
            <div class="flex items-center space-x-1 mb-2">
                <h1 class="text-lg font-semibold">Información del cliente</h1>
                <div v-if="facturaResponse?.cliente?.tipoCliente == 'CLIENTE_ESPONTANEO'" class="text-xs bg-lime-500 text-white font-semibold rounded-xl py-1 px-2">Cliente espontáneo</div>
                <div v-else-if="facturaResponse?.cliente?.tipoCliente == 'MEDICO_AFILIADO'" class="text-xs bg-orange-500 text-white font-semibold rounded-xl py-1 px-2">Médico afiliado</div>
                <div v-else-if="facturaResponse?.cliente?.tipoCliente == 'CLINICA_AFILIADA'" class="text-xs bg-indigo-500 text-white font-semibold rounded-xl py-1 px-2">Clínica afiliada</div>
            </div>

            <div v-if="facturaResponse?.cliente.tipoCliente == 'CLIENTE_ESPONTANEO'" class="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                    <label for="" class="">Nombres</label>
                    <input :value="facturaResponse?.cliente?.persona.nombre" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Apellidos</label>
                    <input :value="facturaResponse?.cliente?.persona.apellido" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Cédula</label>
                    <input :value="facturaResponse?.cliente?.persona.numeroIdentificacion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Teléfono</label>
                    <input :value="facturaResponse?.cliente?.persona.telefono" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Dirección</label>
                    <input :value="facturaResponse?.cliente?.persona.direccion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
            </div>
            <div v-else-if="facturaResponse?.cliente.tipoCliente == 'MEDICO_AFILIADO'" class="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                    <label for="" class="">Nombres</label>
                    <input :value="facturaResponse?.cliente?.persona.nombre" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Apellidos</label>
                    <input :value="facturaResponse?.cliente?.persona.apellido" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Cédula</label>
                    <input :value="facturaResponse?.cliente?.persona.numeroIdentificacion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Teléfono</label>
                    <input :value="facturaResponse?.cliente?.persona.telefono" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Dirección</label>
                    <input :value="facturaResponse?.cliente?.persona.direccion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
            </div>
            <div v-else-if="facturaResponse?.cliente.tipoCliente == 'CLINICA_AFILIADA'" class="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                    <label for="" class="">Nombre</label>
                    <input :value="facturaResponse?.cliente?.persona.nombre" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Razón social</label>
                    <input :value="facturaResponse?.cliente?.persona.razonSocial" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">RUC</label>
                    <input :value="facturaResponse?.cliente?.persona.ruc" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Teléfono</label>
                    <input :value="facturaResponse?.cliente?.persona.telefono" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
                <div>
                    <label for="" class="">Dirección</label>
                    <input :value="facturaResponse?.cliente?.persona.direccion" :readonly="true" class="block bg-slate-100 rounded-lg w-full px-3 py-2" type="text">
                </div>
            </div>
        </div>

        <div>
            <div class="flex items-center justify-between mb-2">
                <h1 class="text-lg font-semibold">Detalle de factura</h1>
            </div>

            <div class="rounded-lg border overflow-x-auto">
                <table class="text-left w-full">
                    <thead class="text-sm bg-gray-100">
                        <tr>
                            <th class="px-6 py-3">ID de solicitud</th>
                            <th class="px-6 py-3">Fecha de solicitud</th>
                            <th class="px-6 py-3">Paciente</th>
                            <th class="px-6 py-3">Médico tratante</th>
                            <th class="px-6 py-3">Procedimiento</th>
                            <th class="px-6 py-3 w-1/6">Precio</th>
                            <th class="px-6 py-3">Solicitud</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr v-for="item in facturaResponse?.detalle" :key="item.id" class="border-b hover:bg-gray-50">
                            <td class="border px-6 py-3">
                                {{ item.id }}
                            </td>
                            <td class="border px-6 py-3">
                                {{ (new Date(item.fechaSolicitud)).toLocaleString('es-NI') }}
                            </td>
                            <td class="border px-6 py-3">
                                {{ item.paciente?.persona.nombre + ' ' + item.paciente?.persona.apellido }}
                            </td>
                            <td class="border px-6 py-3">
                                <span v-if="item.medicoTratante">{{ item.medicoTratante.persona.nombre + ' ' + item.medicoTratante.persona.apellido }}</span>
                                <span v-else>-</span>
                            </td>
                            <td class="border px-6 py-3">
                                {{ item.servicioLaboratorio?.descripcion }}
                            </td>
                            <td class="border px-6 py-3 text-right">
                                C${{ Number(item.servicioLaboratorio?.precio).toFixed(2) }}
                            </td>
                            <td class="border px-6 py-3">
                                <button
                                  @click="handlePdfClick(item.id)"
                                  class="font-semibold text-sm text-white bg-red-400 rounded-md hover:shadow-lg p-2"
                                >
                                    <v-icon class="fa-solid fa-file-pdf"></v-icon>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="p-1">
                                <div class="col-span-2 font-semibold">Subtotal</div>
                            </td>
                            <td class="text-right px-6">
                                <div class="">C${{ facturaResponse?.subtotal.toFixed(2) }}</div>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="p-1">
                                <div class="col-span-2 font-semibold">Descuento</div>
                            </td>
                            <td class="text-right px-6">
                                <div v-if="facturaResponse" class="">- C$ {{ (facturaResponse.subtotal * (facturaResponse.descuento / 100)).toFixed(2) }}</div>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="p-1">
                                <div class="col-span-2 font-semibold">Total</div>
                            </td>
                            <td class="text-right px-6">
                                <div class="">C${{ facturaResponse?.total.toFixed(2) }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

  <div class="font-semibold text-xl text-stone-700 pt-8 px-10">
    <span>Pagos</span>
  </div>
  <div v-if="facturaResponse" class="bg-white rounded border shadow-lg p-6 m-6">
    <PagoModal :factura-id="id" :open="modalPago" v-model="facturaResponse" @toggle="modalPago = !modalPago" />
    <div class="flex justify-between items-center">
      <button
        v-if="facturaResponse.saldoPendiente > 0"
        class="font-semibold text-sm text-white bg-blue-500 rounded-md hover:shadow-lg px-3 py-2"
        @click="modalPago = true"
      >
        Agregar pago
      </button>
      <div v-else></div>
      <div class="text-gray-800">
        <span>Saldo pendiente <b>C${{ facturaResponse.saldoPendiente.toFixed(2) }}</b></span>
      </div>
    </div>
    <div class="rounded-lg border overflow-x-auto mt-5">
      <table class="text-left w-full">
        <thead class="text-sm bg-gray-100">
          <tr>
            <th class="px-6 py-3">Fecha de pago</th>
            <th class="px-6 py-3">Metodo de pago</th>
            <th class="px-6 py-3">Monto</th>
            <th class="px-6 py-3">Estado</th>
            <th class="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="item in facturaResponse?.pagos" :key="item.id" class="border-b hover:bg-gray-50">
            <td class="border px-6 py-3">
              {{ (new Date(item.fechaPago)).toLocaleString('es-NI') }}
            </td>
            <td class="border px-6 py-3">
              {{ item.metodoPago.descripcion }}
            </td>
            <td class="border px-6 py-3">
              {{ item.moneda.signoMonetario + item.monto.toFixed(2) }}
            </td>
            <td class="border px-6 py-3">
              <div v-if="item.deletedAt" class="text-xs bg-red-500 text-white font-semibold rounded-xl w-fit py-1 px-2">Anulado</div>
              <div v-else class="text-xs bg-lime-500 text-white font-semibold rounded-xl w-fit py-1 px-2">Activo</div>
            </td>
            <AuthState>
              <template #default="{ user }">
                <td class="border px-3 py-2">
                  <button v-if="user?.roles.some(role => isAuthorized(role, [SimalsiRoles.ROLE_ADMIN]))" @click="revertirPago(item.id)" class="font-semibold text-sm text-white bg-red-400 rounded-md hover:shadow-lg px-3 py-2">X</button>
                  <div v-else>-</div>
                </td>
              </template>
              <template #placeholder>
                <button class="text-sm font-semibold hover:text-blue-500" disabled>
                  <span class="animate-pulse">Cargando...</span>
                </button>
              </template>
            </AuthState>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
