<script setup lang="ts">
import { ref } from 'vue'
import PedidoCard from '@comp/dashboard/admin/PedidoCard.vue'
import StockMovementModal from '@comp/dashboard/admin/StockMovementModal.vue'
import { useClientStore } from '@store/cliente'
import { useSaboresStore } from '@store/sabores'

const store = useClientStore()
const saboresStore = useSaboresStore()

const isMovementModalOpen = ref(false)
const selectedSabor = ref<any>(null)

const openMovementModal = (sabor: any) => {
  selectedSabor.value = sabor
  isMovementModalOpen.value = true
}

const handleMovementSaved = async () => {
  // Optionally refresh other data if needed
  // Stock is already refreshed by the store action
}
</script>

<template>
  <main class="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Pedidos Recientes</h1>
      <p class="text-sm text-gray-500">Gestiona los pedidos de todos los usuarios</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Stock Panel (Side) -->
      <div class="lg:col-span-1 space-y-4">
        <div class="bg-white rounded-xl shadow-xs border border-gray-100 p-4 sticky top-4">
          <h2 class="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Stock Actual</h2>

          <div v-if="saboresStore.isLoading" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="sabor in saboresStore.sabores"
              :key="sabor.id_sabor"
              @click="openMovementModal(sabor)"
              class="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group"
            >
              <span class="text-gray-700 font-medium group-hover:text-pink-600 transition-colors">{{ sabor.nombre }}</span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold" :class="sabor.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'">
                {{ sabor.stock }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pedidos List (Main) -->
      <div class="lg:col-span-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PedidoCard v-for="pedido in store.pedidos" :key="pedido.id_pedido" :orden="pedido" />
        </div>
      </div>
    </div>

    <StockMovementModal :isOpen="isMovementModalOpen" :sabor="selectedSabor" @close="isMovementModalOpen = false" @save="handleMovementSaved" />
  </main>
</template>
