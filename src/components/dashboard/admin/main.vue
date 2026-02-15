<script setup lang="ts">
import { ref, computed } from 'vue'
import PedidoCard from '@comp/dashboard/admin/PedidoCard.vue'
import StockMovementModal from '@comp/dashboard/admin/StockMovementModal.vue'
import { useClientStore } from '@store/cliente'
import { useSaboresStore } from '@store/sabores'

const store = useClientStore()
const saboresStore = useSaboresStore()

const isMovementModalOpen = ref(false)
const selectedSabor = ref<any>(null)
const currentFilter = ref('todos')

const openMovementModal = (sabor: any) => {
  selectedSabor.value = sabor
  isMovementModalOpen.value = true
}

const handleMovementSaved = async () => {
  await saboresStore.fetchSabores()
}

const filteredPedidos = computed(() => {
  if (currentFilter.value === 'todos') {
    return store.pedidos
  }
  return store.pedidos.filter((pedido) => pedido.estado === currentFilter.value)
})

const filters = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendiente', label: 'Pendientes', class: 'status-pendiente' },
  { value: 'completado', label: 'Completados', class: 'status-completado' },
  { value: 'porcobrar', label: 'Por Cobrar', class: 'status-porcobrar' },
  { value: 'canje', label: 'Canjes', class: 'status-canje' },
  { value: 'cancelado', label: 'Cancelados', class: 'status-cancelado' }
]
</script>

<template>
  <main class="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
    <div class="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-gray-900 tracking-tight">Pedidos Recientes</h1>
        <p class="text-xs text-gray-500">Gestiona los pedidos de todos los usuarios</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="currentFilter = filter.value"
          class="px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border"
          :class="[
            currentFilter === filter.value
              ? filter.value === 'todos'
                ? 'bg-gray-900 text-white border-gray-900'
                : filter.class + ' border-transparent ring-2 ring-offset-1 ring-gray-100'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Stock Panel (Side) -->
      <div class="lg:col-span-3 space-y-3">
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sticky top-4">
          <h2 class="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Stock Actual</h2>

          <div v-if="saboresStore.isLoading" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
          </div>

          <div v-else class="space-y-1">
            <div
              v-for="sabor in saboresStore.sabores"
              :key="sabor.id_sabor"
              @click="openMovementModal(sabor)"
              class="flex justify-between items-center text-xs p-1.5 rounded-md hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group"
            >
              <span class="text-gray-700 font-medium group-hover:text-pink-600 transition-colors truncate mr-2">{{ sabor.nombre }}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold min-w-[24px] text-center" :class="sabor.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'">
                {{ sabor.stock }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pedidos List (Main) -->
      <div class="lg:col-span-9">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <PedidoCard v-for="pedido in filteredPedidos" :key="pedido.id_pedido" :orden="pedido" />
        </div>
      </div>
    </div>

    <StockMovementModal :isOpen="isMovementModalOpen" :sabor="selectedSabor" @close="isMovementModalOpen = false" @save="handleMovementSaved" />
  </main>
</template>
