<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { userStore } from '@store/user'
import { useSaboresStore } from '@store/sabores'
import { useClientStore } from '@store/cliente'
import StockMovementModal from '@comp/dashboard/admin/StockMovementModal.vue'

const user = userStore()
const saboresStore = useSaboresStore()
const clientStore = useClientStore()
const isCreating = ref(false)
const isStockModalOpen = ref(false)
const isNewSaborModalOpen = ref(false)
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
    await saboresStore.fetchSabores()
    isNewSaborModalOpen.value = false
  } catch (error) {
    console.error('Error al crear sabor:', error)
  } finally {
    isCreating.value = false
  }
}

// Reporte de Ventas por Sabor
const reporteSabores = computed(() => {
  const stats = new Map<string, { vendidos: number; ingresos: number }>()
  
  // Agregamos desde todos los pedidos completados
  for (const p of clientStore.pedidos) {
    if (p.estado === 'completado' && !p.es_canje && p.detalle) {
      for (const item of p.detalle) {
        if (!stats.has(item.sabor)) {
          stats.set(item.sabor, { vendidos: 0, ingresos: 0 })
        }
        const s = stats.get(item.sabor)!
        s.vendidos += Number(item.cantidad) || 0
        s.ingresos += Number(item.subtotal) || 0
      }
    }
  }

  return (saboresStore.sabores || []).map((s: any) => {
    const st = stats.get(s.nombre) || { vendidos: 0, ingresos: 0 }
    return {
      ...s,
      vendidos: st.vendidos,
      ingresos: st.ingresos
    }
  }).sort((a,b) => b.vendidos - a.vendidos)
})

const totalVentasGlobal = computed(() => reporteSabores.value.reduce((acc, s) => acc + s.ingresos, 0))
const totalHeladosGlobal = computed(() => reporteSabores.value.reduce((acc, s) => acc + s.vendidos, 0))
const totalStockGlobal = computed(() => reporteSabores.value.reduce((acc, s) => acc + (s.stock || 0), 0))
</script>

<template>
  <div v-if="user.isAdmin" class="space-y-5 animate-fade-in pb-6">

    <!-- Resumen General -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      <div class="bg-white/95 backdrop-blur-xl rounded-xl p-3 shadow-sm border border-pink-100 flex flex-col justify-between group overflow-hidden relative">
        <div class="absolute inset-0 bg-linear-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-1.5 mb-1.5 relative z-10">
          <span class="bg-pink-100 text-pink-600 p-1 rounded-lg text-sm">💰</span>
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ingresos</span>
        </div>
        <div class="relative z-10">
          <span class="text-base font-bold text-pink-600">S/ {{ totalVentasGlobal.toFixed(2) }}</span>
        </div>
      </div>
      <div class="bg-white/95 backdrop-blur-xl rounded-xl p-3 shadow-sm border border-cyan-100 flex flex-col justify-between group overflow-hidden relative">
        <div class="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-1.5 mb-1.5 relative z-10">
          <span class="bg-cyan-100 text-cyan-600 p-1 rounded-lg text-sm">🍦</span>
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vendidos</span>
        </div>
        <div class="relative z-10">
          <span class="text-base font-bold text-cyan-600">{{ totalHeladosGlobal }}</span>
        </div>
      </div>
      <div class="bg-white/95 backdrop-blur-xl rounded-xl p-3 shadow-sm border border-emerald-100 flex flex-col justify-between group overflow-hidden relative">
        <div class="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-1.5 mb-1.5 relative z-10">
          <span class="bg-emerald-100 text-emerald-600 p-1 rounded-lg text-sm">📦</span>
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Stock Total</span>
        </div>
        <div class="relative z-10">
          <span class="text-base font-bold text-emerald-600">{{ totalStockGlobal }}</span>
        </div>
      </div>
      <div class="bg-white/95 backdrop-blur-xl rounded-xl p-3 shadow-sm border border-purple-100 flex flex-col justify-between group overflow-hidden relative">
        <div class="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-1.5 mb-1.5 relative z-10">
          <span class="bg-purple-100 text-purple-600 p-1 rounded-lg text-sm">✨</span>
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sabores</span>
        </div>
        <div class="relative z-10">
          <span class="text-base font-bold text-purple-600">{{ reporteSabores.length }}</span>
        </div>
      </div>
    </div>

    <!-- Inventario y Ventas Datatable -->
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative z-10 flex flex-col">
      <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-base font-black text-gray-800 flex items-center gap-2"><span class="text-xl drop-shadow-sm filter-none">📊</span> Reporte e Inventario de Sabores</h3>
        <button 
          @click="isNewSaborModalOpen = true" 
          class="bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-black text-xs px-4 py-2 rounded-xl shadow-lg shadow-pink-200 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
        >
          🪄 Nuevo Sabor
        </button>
      </div>
      <div class="overflow-x-auto overflow-y-auto max-h-[600px] w-full custom-scrollbar">
        <table class="w-full text-sm text-left whitespace-nowrap min-w-max">
          <thead class="text-[11px] text-gray-500 bg-gray-50/95 backdrop-blur-md uppercase tracking-widest sticky top-0 z-20 shadow-sm border-b border-gray-100">
            <tr>
              <th scope="col" class="px-6 py-4 font-black">Sabor Original</th>
              <th scope="col" class="px-6 py-4 font-black text-center">Unidades Listas</th>
              <th scope="col" class="px-6 py-4 font-black text-center">Precio Uni.</th>
              <th scope="col" class="px-6 py-4 font-black text-center bg-cyan-50/30">Vendidos</th>
              <th scope="col" class="px-6 py-4 font-black text-right bg-emerald-50/30">Ingresos Totales (S/)</th>
              <th scope="col" class="px-6 py-4 font-black text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="(sabor, index) in reporteSabores" :key="sabor.id_sabor" class="hover:bg-gray-50/80 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-black shadow-inner border border-white">
                    <span>{{ index + 1 }}</span>
                  </div>
                  <span class="font-bold text-gray-800 text-[13px]">{{ sabor.nombre }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="font-black px-3 py-1.5 rounded-xl border"
                      :class="sabor.stock < 10 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-gray-50 text-gray-700 border-gray-100'">
                  {{ sabor.stock }} u.
                </span>
                <div v-if="sabor.stock < 10" class="text-[9px] text-red-500 font-bold tracking-widest mt-1 uppercase">Poco stock</div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="text-xs font-bold text-gray-500 tracking-tight">S/ {{ Number(sabor.precio).toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4 text-center bg-cyan-50/10">
                <span class="font-black text-cyan-600 bg-cyan-50 border border-cyan-100 px-2.5 py-1 rounded-lg">
                  {{ sabor.vendidos }}
                </span>
              </td>
              <td class="px-6 py-4 text-right bg-emerald-50/10">
                <span class="font-black text-emerald-600 tracking-tight">
                  S/ {{ sabor.ingresos.toFixed(2) }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <button
                  @click="openStockModal(sabor)"
                  class="text-[10px] font-black text-pink-600 hover:text-white bg-pink-50 hover:bg-pink-500 px-3.5 py-1.5 rounded-xl transition-all shadow-sm border border-pink-100 hover:border-pink-500 active:scale-95 uppercase tracking-widest inline-flex items-center gap-1.5"
                >
                  ✏️ Ajustar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Cambio Stock -->
    <StockMovementModal :isOpen="isStockModalOpen" :sabor="selectedSabor" @close="isStockModalOpen = false" @save="handleStockSaved" />

    <!-- Modal Nuevo Sabor -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isNewSaborModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="isNewSaborModalOpen = false">
        <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-md transition-all pointer-events-none"></div>

        <Transition
          enter-active-class="transition ease-out duration-300 transform"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition ease-in duration-200 transform"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div v-if="isNewSaborModalOpen" class="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl shadow-black/10 border border-white/60 relative z-10 transition-all">
            <div class="px-5 py-4 border-b border-gray-100/60 flex justify-between items-center bg-white/50">
              <h3 class="text-sm font-black text-gray-900 flex items-center gap-2"><span class="text-lg">🪄</span> Crear Nuevo Sabor</h3>
              <button @click="isNewSaborModalOpen = false" class="text-gray-400 hover:text-pink-600 hover:bg-pink-50 p-1.5 rounded-xl transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleCreateSabor" class="p-6 space-y-4">
              <div>
                <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Nombre</label>
                <input
                  v-model="newSabor.nombre"
                  type="text"
                  placeholder="Ej. Fresa con Leche"
                  class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-100/80 px-4 text-sm font-bold text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all shadow-inner"
                  required
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Precio (S/)</label>
                  <input
                    v-model.number="newSabor.precio"
                    type="number"
                    step="0.01"
                    min="0"
                    class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-100/80 px-4 text-sm font-bold text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all shadow-inner"
                    required
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Stock Inv.</label>
                  <input
                    v-model.number="newSabor.stock_inicial"
                    type="number"
                    min="0"
                    class="h-11 w-full rounded-2xl border border-gray-200 bg-gray-100/80 px-4 text-sm font-bold text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
              <div class="pt-4">
                <button
                  type="submit"
                  :disabled="isCreating || !newSabor.nombre"
                  class="h-11 w-full bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-black rounded-xl shadow-lg shadow-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span v-if="isCreating" class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                  {{ isCreating ? 'Guardando...' : '✨ Registrar Sabor' }}
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f9fafb;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}
</style>
