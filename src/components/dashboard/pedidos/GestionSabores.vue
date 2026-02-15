<script setup lang="ts">
import { ref, reactive } from 'vue'
import { userStore } from '@store/user'
import { useSaboresStore } from '@store/sabores'
import StockMovementModal from '@comp/dashboard/admin/StockMovementModal.vue'

const user = userStore()
const saboresStore = useSaboresStore()
const isCreating = ref(false)
const isStockModalOpen = ref(false)
const selectedSabor = ref<any>(null)

const newSabor = reactive({
  nombre: '',
  precio: 0,
  stock_inicial: 0
})

const openStockModal = (sabor: any) => {
  if (!user.isAdmin) return
  selectedSabor.value = sabor
  isStockModalOpen.value = true
}

const handleStockSaved = async () => {
  await saboresStore.fetchSabores()
}

const handleCreateSabor = async () => {
  if (!newSabor.nombre || newSabor.precio <= 0) return
  isCreating.value = true
  try {
    await saboresStore.createSabor({
      nombre: newSabor.nombre,
      precio: newSabor.precio,
      stock: newSabor.stock_inicial
    })

    newSabor.nombre = ''
    newSabor.precio = 0
    newSabor.stock_inicial = 0
    await saboresStore.fetchSabores()
  } catch (error) {
    console.error('Error al crear sabor:', error)
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <div>
    <div v-if="user.isAdmin" class="mb-6 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
      <h2 class="text-xs font-bold text-gray-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
        <span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
        Nuevo Sabor
      </h2>
      <form @submit.prevent="handleCreateSabor" class="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombre</label>
          <input
            v-model="newSabor.nombre"
            type="text"
            placeholder="Ej. Fresa"
            class="h-8 w-full rounded bg-gray-50 border border-gray-200 px-2.5 text-xs focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
            required
          />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Precio</label>
          <input
            v-model.number="newSabor.precio"
            type="number"
            step="0.01"
            min="0"
            class="h-8 w-full rounded bg-gray-50 border border-gray-200 px-2.5 text-xs focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
            required
          />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Stock Inicial</label>
          <input
            v-model.number="newSabor.stock_inicial"
            type="number"
            min="0"
            class="h-8 w-full rounded bg-gray-50 border border-gray-200 px-2.5 text-xs focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
          />
        </div>
        <div>
          <button
            type="submit"
            :disabled="isCreating || !newSabor.nombre"
            class="h-8 w-full bg-pink-600 hover:bg-pink-700 text-white font-bold rounded text-xs shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isCreating ? 'Guardando...' : 'Crear Sabor' }}
          </button>
        </div>
      </form>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      <div
        v-for="sabor in saboresStore.sabores"
        :key="sabor.id_sabor"
        @click="openStockModal(sabor)"
        class="group relative bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:border-pink-200 hover:shadow-md transition-all cursor-pointer overflow-hidden"
      >
        <div class="flex flex-col h-full justify-between">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xs font-bold text-gray-800 truncate pr-2">{{ sabor.nombre }}</h3>
            <span class="text-[10px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">S/ {{ sabor.precio }}</span>
          </div>

          <div class="flex items-end justify-between mt-auto">
            <div class="flex flex-col">
              <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Stock</span>
              <span class="text-sm font-black" :class="sabor.stock < 10 ? 'text-red-500' : 'text-gray-800'">{{ sabor.stock }}</span>
            </div>

            <div v-if="user.isAdmin" class="bg-pink-50 text-pink-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <StockMovementModal :isOpen="isStockModalOpen" :sabor="selectedSabor" @close="isStockModalOpen = false" @save="handleStockSaved" />
  </div>
</template>
