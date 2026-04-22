<script setup lang="ts">
import { ref, computed } from 'vue'
import { userStore } from '@store/user'
import { useClientStore } from '@store/cliente'
import Modal from '@comp/common/Modal.vue'

import MisPedidos from '@comp/dashboard/pedidos/MisPedidos.vue'
import GestionSabores from '@comp/dashboard/pedidos/GestionSabores.vue'
import FormularioPedido from '@comp/dashboard/pedidos/FormularioPedido.vue'
import FormularioPedidoAdmin from '@comp/dashboard/pedidos/FormularioPedidoAdmin.vue'

const user = userStore()
const clientStore = useClientStore()

const hasPendingOrder = computed(() => {
  return clientStore.pedidos.some((p: any) => p.estado === 'pendiente' || p.estado === 'por cobrar' || p.estado === 'preparando')
})

const isModalOpen = ref(false)
const isAdminModalOpen = ref(false)

const isLoading = ref(false)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-24 md:pb-4">
    <div>
      <div class="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="animate-fade-in relative z-10">
          <h1 class="text-lg md:text-xl font-bold bg-linear-to-r from-pink-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
            {{ user.isAdmin ? 'Gestión de Sabores' : 'Mis Dulces Pedidos' }}
          </h1>
          <p v-if="user.isAdmin" class="text-gray-400 mt-0.5 text-xs font-medium">Administra el stock y crea nuevos sabores.</p>
          <p v-else class="text-gray-400 mt-0.5 text-xs font-medium">Revisa todo tu historial de deliciosas compras.</p>
        </div>
        <div class="relative group w-full md:w-auto mt-1 md:mt-0">
          <button
            v-if="!user.isAdmin"
            @click="hasPendingOrder ? null : $router.push('/pos')"
            :disabled="hasPendingOrder"
            class="h-9 md:h-8 w-full md:w-auto px-4 text-xs font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
            :class="
              hasPendingOrder ? 'bg-gray-100 text-gray-400 border border-gray-200 shadow-none cursor-not-allowed' : 'bg-linear-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white hover:shadow-cyan-200 hover:-translate-y-0.5 active:scale-95'
            "
          >
            <span class="text-sm">{{ hasPendingOrder ? '⏳' : '🍦' }}</span>
            {{ hasPendingOrder ? 'Pedido en Proceso' : 'Nuevo Pedido' }}
          </button>

          <button
            v-if="user.isAdmin"
            @click="isAdminModalOpen = true"
            class="h-9 md:h-8 w-full md:w-auto px-4 text-xs font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5 bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white hover:shadow-pink-200 hover:-translate-y-0.5 active:scale-95"
          >
            <span class="text-sm">🛍️</span>
            Crear Pedido para Cliente
          </button>

          <div
            v-if="hasPendingOrder"
            class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] font-bold text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border border-gray-700"
          >
            Termina tu pedido para hacer otro
            <svg class="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
      <span class="ml-3 text-cyan-600 font-medium">Actualizando datos...</span>
    </div>

    <div v-else>
      <GestionSabores v-if="user.isAdmin" />
      <MisPedidos v-else />
    </div>
  </div>

  <Modal :isOpen="isModalOpen" @close="isModalOpen = false">
    <template #header>
      <h3 class="text-base font-bold text-gray-800">Registrar Nuevo Pedido</h3>
    </template>
    <template #body>
      <FormularioPedido @close="isModalOpen = false" @refresh="clientStore.update_pedidos()" />
    </template>
  </Modal>

  <Modal :isOpen="isAdminModalOpen" @close="isAdminModalOpen = false">
    <template #header>
      <h3 class="text-base font-bold text-gray-800">Registrar Pedido (Admin)</h3>
    </template>
    <template #body>
      <!-- Usamos un timeout o un refresh directo global para el admin si tuviese algun loader especial, aqui se hace emit('refresh') en el form -->
      <FormularioPedidoAdmin @close="isAdminModalOpen = false" @refresh="clientStore.pedidos_admin()" />
    </template>
  </Modal>
</template>
