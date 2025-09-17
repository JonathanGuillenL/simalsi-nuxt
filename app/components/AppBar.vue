<script setup lang="ts">
import { SimalsiRoles } from '~/constants/roles';
import useWindowSize from '~/composables/useWindowSize';

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['toggle'])

const { match } = useWindowSize(640)

function isAuthorized(userRole: string, roles: unknown[]): boolean {
  return roles.includes(userRole)
}
</script>

<template>
  <div v-if="!match && open" class="fixed inset-0 bg-black/60 z-20" @click="$emit('toggle')"></div>
  <aside
    :class="{ '-translate-x-64': !open }"
    class="fixed top-0 bottom-0 z-20 bg-zinc-50 w-64 shadow-2xl border-r px-4 pb-20 duration-300 overflow-y-auto"
  >
    <div class="flex justify-center items-center px-4 py-5">
      <NuxtLink to="/" class="text-black text-2xl font-semibold">SIMALSI</NuxtLink>
    </div>
    <AuthState>
      <template #default="{ user }">
        <nav>
          <ul class="space-y-1">
            <li>
              <NuxtLink
                to="/home"
                class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
                active-class="bg-blue-100 !border-stone-200"
              >
                <VIcon class="mr-2" icon="fa fa-house" size="x-small" />
                <span>Home</span>
              </NuxtLink>
            </li>

            <div class="text-sm text-black mt-5">Solicitud</div>
            <li>
              <NuxtLink
                v-if="user?.roles.some(role => isAuthorized(role, [SimalsiRoles.ROLE_ADMIN, SimalsiRoles.ROLE_RECEPCIONISTA]))"
                to="/paciente"
                class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
                active-class="bg-blue-100 !border-stone-200"
              >
                <VIcon class="mr-2" icon="fa fa-hospital-user" size="x-small" />
                <span>Paciente</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                v-if="user?.roles.some(role => isAuthorized(role, [SimalsiRoles.ROLE_ADMIN, SimalsiRoles.ROLE_RECEPCIONISTA]))"
                to="/medico-tratante"
                class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
                active-class="bg-blue-100 !border-stone-200"
              >
                <VIcon class="mr-2" icon="fa fa-user-doctor" size="x-small" />
                <span>Médico tratante</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/solicitud"
                class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
                active-class="bg-blue-100 !border-stone-200"
              >
                <VIcon class="mr-2" icon="fa fa-file-lines" size="x-small" />
                <span>Solicitud</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                v-if="user?.roles.some(role => isAuthorized(role, [SimalsiRoles.ROLE_HISTOTECNOLOGO, SimalsiRoles.ROLE_PATOLOGO]))"
                to="/historial"
                class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
                active-class="bg-blue-100 !border-stone-200"
              >
                <VIcon class="mr-2" icon="fa fa-hospital-user" size="x-small" />
                <span>Historial de solicitudes</span>
              </NuxtLink>
            </li>

            <div class="text-sm text-black mt-5">Servicios</div>
            <li>
              <NuxtLink
              v-if="user?.roles.some(role => isAuthorized(role, [SimalsiRoles.ROLE_ADMIN, SimalsiRoles.ROLE_HISTOTECNOLOGO, SimalsiRoles.ROLE_PATOLOGO]))"
                to="/procedimiento"
                class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
                active-class="bg-blue-100 !border-stone-200"
              >
                <VIcon class="mr-2" icon="fa fa-syringe" size="x-small" />
                <span>Procedimientos</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                v-if="user?.roles.some(role => isAuthorized(role, [SimalsiRoles.ROLE_ADMIN, SimalsiRoles.ROLE_HISTOTECNOLOGO, SimalsiRoles.ROLE_PATOLOGO]))"
                to="/region"
                class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
                active-class="bg-blue-100 !border-stone-200"
              >
                <VIcon class="mr-2" icon="fa fa-lungs" size="x-small" />
                <span>Regiones anátomicas</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                v-if="user?.roles.some(role => isAuthorized(role, [SimalsiRoles.ROLE_ADMIN, SimalsiRoles.ROLE_RECEPCIONISTA]))"
                to="/servicio"
                class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
                active-class="bg-blue-100 !border-stone-200"
              >
                <VIcon class="mr-2" icon="fa fa-flask" size="x-small" />
                <span>Servicio laboratorio</span>
              </NuxtLink>
            </li>

            <div v-if="user?.roles.some(role => isAuthorized(role, [SimalsiRoles.ROLE_ADMIN, SimalsiRoles.ROLE_RECEPCIONISTA]))" class="text-sm text-black mt-5">Facturación</div>
            <li>
              <NuxtLink
                v-if="user?.roles.some(role => isAuthorized(role, [SimalsiRoles.ROLE_ADMIN, SimalsiRoles.ROLE_RECEPCIONISTA]))"
                to="/cliente"
                class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
                active-class="bg-blue-100 !border-stone-200"
              >
                <VIcon class="mr-2" icon="fa fa-file-lines" size="x-small" />
                <span>Cliente</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                v-if="user?.roles.some(role => isAuthorized(role, [SimalsiRoles.ROLE_ADMIN, SimalsiRoles.ROLE_RECEPCIONISTA]))"
                to="/factura"
                class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
                active-class="bg-blue-100 !border-stone-200"
              >
                <VIcon class="mr-2" icon="fa fa-file-invoice" size="x-small" />
                <span>Factura</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                v-if="user?.roles.some(role => isAuthorized(role, [SimalsiRoles.ROLE_ADMIN, SimalsiRoles.ROLE_RECEPCIONISTA]))"
                to="/metodo-pago"
                class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
                active-class="bg-blue-100 !border-stone-200"
              >
                <VIcon class="mr-2" icon="fa fa-wallet" size="x-small" />
                <span>Método de pago</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                v-if="user?.roles.some(role => isAuthorized(role, [SimalsiRoles.ROLE_ADMIN, SimalsiRoles.ROLE_RECEPCIONISTA]))"
                to="/moneda"
                class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
                active-class="bg-blue-100 !border-stone-200"
              >
                <VIcon class="mr-2" icon="fa fa-coins" size="x-small" />
                <span>Moneda</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                v-if="user?.roles.some(role => isAuthorized(role, [SimalsiRoles.ROLE_ADMIN, SimalsiRoles.ROLE_RECEPCIONISTA]))"
                to="/descuento"
                class="flex items-center border-2 border-transparent text-base text-black font-semibold hover:bg-blue-100 rounded-lg px-4 py-3"
                active-class="bg-blue-100 !border-stone-200"
              >
                <VIcon class="mr-2" icon="fa fa-percent" size="x-small" />
                <span>Descuento</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </template>
      <template #placeholder>
        <button class="text-sm font-semibold hover:text-blue-500" disabled>
          <span class="animate-pulse">Cargando...</span>
        </button>
      </template>
    </AuthState>
  </aside>
</template>
