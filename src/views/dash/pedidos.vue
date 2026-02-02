<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { userStore } from '@store/user'
import { useSaboresStore } from '@store/sabores'
import { useClientStore } from '@store/cliente'
import Modal from '@comp/common/Modal.vue'

// Import new components
import MisPedidos from '@comp/dashboard/pedidos/MisPedidos.vue'
import GestionSabores from '@comp/dashboard/pedidos/GestionSabores.vue'
import FormularioPedido from '@comp/dashboard/pedidos/FormularioPedido.vue'

const user = userStore()
const saboresStore = useSaboresStore()
const clientStore = useClientStore()

const isLoading = computed(() => saboresStore.isLoading)
const isModalOpen = ref(false)

const fetchData = async () => {
  await saboresStore.fetchSabores()
  if (!user.isAdmin) {
    await clientStore.update_pedidos()
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="md:hidden flex items-center justify-between p-3 bg-white border-b border-gray-100 gap-2 sticky top-0 z-30">
    <div class="text-center flex-1">
      <p class="font-black text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-cyan-500 text-sm">Gestionar Pedidos</p>
    </div>
  </div>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
    <MisPedidos v-if="!user.isAdmin" />

    <div v-if="isLoading" class="text-center py-12">
      <p class="text-sm text-gray-500 animate-pulse">Cargando sabores...</p>
    </div>

    <GestionSabores v-else @open-modal="isModalOpen = true" />
  </main>

  <Modal :isOpen="isModalOpen" @close="isModalOpen = false">
    <template #header>
      <h3 class="text-base font-bold text-gray-800">Registrar Nuevo Pedido</h3>
    </template>
    <template #body>
      <FormularioPedido @close="isModalOpen = false" @refresh="fetchData" />
    </template>
  </Modal>
</template>
