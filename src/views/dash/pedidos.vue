<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userStore } from '@store/user'
import { useSaboresStore } from '@store/sabores'
import { useClientStore } from '@store/cliente'
import Modal from '@comp/common/Modal.vue'

import MisPedidos from '@comp/dashboard/pedidos/MisPedidos.vue'
import GestionSabores from '@comp/dashboard/pedidos/GestionSabores.vue'
import FormularioPedido from '@comp/dashboard/pedidos/FormularioPedido.vue'

const user = userStore()
const saboresStore = useSaboresStore()
const clientStore = useClientStore()

const isModalOpen = ref(false)

const isLoading = ref(false)

const fetchData = async () => {
  try {
    isLoading.value = true
    await saboresStore.fetchSabores()
    if (!user.isAdmin) {
      await clientStore.update_pedidos()
    }
    isModalOpen.value = false
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
    <div>
      <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black bg-linear-to-r from-pink-600 to-cyan-600 bg-clip-text text-transparent">Gestión de Sabores</h1>
          <p v-if="user.isAdmin" class="text-gray-600 mt-1 text-sm font-medium">Administra stock y crea nuevos sabores.</p>
        </div>
        <button
          v-if="!user.isAdmin"
          @click="isModalOpen = true"
          class="h-10 px-5 bg-linear-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="25" y2="8" />
            <line x1="22" y1="5" x2="22" y2="11" />
          </svg>
          Registrar Pedido
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
      <span class="ml-3 text-cyan-600 font-medium">Actualizando datos...</span>
    </div>

    <div v-else>
      <GestionSabores @open-modal="isModalOpen = true" />
      <MisPedidos />
    </div>
  </main>

  <Modal :isOpen="isModalOpen" @close="isModalOpen = false">
    <template #header>
      <h3 class="text-base font-bold text-gray-800">Registrar Nuevo Pedido</h3>
    </template>
    <template #body>
      <FormularioPedido @close="isModalOpen = false" @refresh="async () => await fetchData()" />
    </template>
  </Modal>
</template>
