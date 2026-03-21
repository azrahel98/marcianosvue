<script setup lang="ts">
import { ref, computed } from 'vue'
import StatusModal from './StatusModal.vue'
import { useClientStore } from '@store/cliente'
import { format } from 'date-fns'

const store = useClientStore()

const isModalOpen = ref(false)
const selectedOrderId = ref<number | null>(null)
const selectedOrderStatus = ref<string>('')
const searchQuery = ref('')

const openStatusModal = (pedido: any) => {
  selectedOrderId.value = pedido.id_pedido
  selectedOrderStatus.value = pedido.estado
  isModalOpen.value = true
}

const handleStatusChange = async (newStatus: string) => {
  if (selectedOrderId.value) {
    try {
      await store.updateStatus(selectedOrderId.value, newStatus)
      isModalOpen.value = false
    } catch (error) {
      console.error(error)
    }
  }
}

const filters = [
  { value: 'todos', label: '✨ Todos los estados' },
  { value: 'pendiente', label: '🟠 Pendientes' },
  { value: 'completado', label: '🟢 Completados' },
  { value: 'porcobrar', label: '🔵 Por Cobrar' },
  { value: 'canje', label: '🟣 Canjes' },
  { value: 'cancelado', label: '🔴 Cancelados' },
  { value: 'acuenta', label: '⚪ A Cuenta' }
]

const currentFilter = ref('todos')

const filteredPedidos = computed(() => {
  let orders = store.pedidos
  
  if (currentFilter.value !== 'todos') {
    orders = orders.filter((p: any) => p.estado === currentFilter.value)
  }
  
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    orders = orders.filter((p: any) => 
      (p.usuario && p.usuario.toLowerCase().includes(q)) || 
      p.id_pedido.toString().includes(q)
    )
  }
  
  return orders
})

const searchSummary = computed(() => {
  const summary = {
    completado: 0,
    porcobrar: 0,
    acuenta: 0,
    pendiente: 0,
    count: filteredPedidos.value.length
  }

  for (const p of filteredPedidos.value) {
    const amount = Number(p.total_pedido) || 0
    if (p.estado === 'completado') summary.completado += amount
    else if (p.estado === 'porcobrar') summary.porcobrar += amount
    else if (p.estado === 'acuenta') summary.acuenta += amount
    else if (p.estado === 'pendiente') summary.pendiente += amount
  }

  return summary
})

const clientsProgress = computed(() => {
  const map = new Map<string, { usuario: string; heladosComprados: number; canjesUsados: number; totalGastado: number; ultPedido: string }>()

  for (const p of store.pedidos) {
    if (!p.usuario || p.usuario.trim() === '') continue

    if (!map.has(p.usuario)) {
      map.set(p.usuario, { usuario: p.usuario, heladosComprados: 0, canjesUsados: 0, totalGastado: 0, ultPedido: p.fecha })
    }

    const client = map.get(p.usuario)!
    
    if (new Date(p.fecha) > new Date(client.ultPedido)) {
      client.ultPedido = p.fecha
    }

    if (p.estado === 'completado') {
      if (p.es_canje) {
        client.canjesUsados += 1
      } else {
        const cant = p.detalle?.reduce((sum: number, item: any) => sum + Number(item.cantidad), 0) || 0
        client.heladosComprados += cant
        client.totalGastado += Number(p.total_pedido) || 0
      }
    }
  }

  return Array.from(map.values()).map(c => {
    // Estimación de progreso local
    const heladosDisponibles = Math.max(0, c.heladosComprados - (c.canjesUsados * 10))
    const puntos = heladosDisponibles % 10
    const canjesDisponibles = Math.floor(heladosDisponibles / 10)
    const faltan = 10 - puntos
    
    return {
      ...c,
      puntos,
      faltan,
      canjesDisponibles
    }
  }).sort((a, b) => {
    if (b.canjesDisponibles !== a.canjesDisponibles) return b.canjesDisponibles - a.canjesDisponibles
    if (b.puntos !== a.puntos) return b.puntos - a.puntos
    return b.totalGastado - a.totalGastado
  })
})
</script>

<template>
  <main class="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-20">
    <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="animate-fade-in relative z-10 whitespace-nowrap">
        <h1 class="text-2xl md:text-3xl font-black bg-linear-to-r from-pink-600 to-cyan-600 bg-clip-text text-transparent tracking-tight pb-1 flex items-center gap-2">
          <span class="text-3xl drop-shadow-sm filter-none text-black">📋</span> Historial de Pedidos
        </h1>
        <p class="text-gray-500 mt-1 text-sm font-bold">Resumen general de pedidos del sistema.</p>
      </div>

      <div class="w-full md:max-w-xl flex flex-col sm:flex-row gap-3 relative animate-fade-in">
        <div class="relative w-full sm:w-1/3 shrink-0">
          <select
            v-model="currentFilter"
            class="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-2xl outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-300 p-3.5 transition-all shadow-sm font-bold appearance-none cursor-pointer pr-10"
          >
            <option v-for="f in filters" :key="f.value" :value="f.value">{{ f.label }}</option>
          </select>
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span class="text-gray-400 text-lg">🔍</span>
          </div>
          <input
            type="search"
            v-model="searchQuery"
            class="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-2xl outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-300 block pl-11 p-3.5 transition-all shadow-sm font-medium"
            placeholder="Buscar por cliente o ID..."
          >
        </div>
      </div>
    </div>

    <!-- Resumen Dinámico -->
    <div v-if="filteredPedidos.length > 0" class="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in relative z-10">
      <!-- Ingresos Completados -->
      <div class="bg-white rounded-3xl p-5 shadow-sm shadow-gray-100/50 border border-emerald-100/50 flex flex-col justify-between group overflow-hidden relative">
        <div class="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-2 mb-2 relative z-10">
          <span class="bg-emerald-100 text-emerald-600 p-1.5 rounded-xl text-lg shadow-sm">💰</span>
          <span class="text-xs font-black text-gray-500 uppercase tracking-widest">Completados</span>
        </div>
        <div class="relative z-10">
          <span class="text-2xl font-black text-emerald-600">S/ {{ searchSummary.completado.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Deuda (Por Cobrar) -->
      <div class="bg-white rounded-3xl p-5 shadow-sm shadow-gray-100/50 border border-red-100/50 flex flex-col justify-between group overflow-hidden relative">
        <div class="absolute inset-0 bg-linear-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-2 mb-2 relative z-10">
          <span class="bg-red-100 text-red-600 p-1.5 rounded-xl text-lg shadow-sm">🚨</span>
          <span class="text-xs font-black text-gray-500 uppercase tracking-widest">Deuda Total</span>
        </div>
        <div class="relative z-10">
          <span class="text-2xl font-black text-red-600">S/ {{ searchSummary.porcobrar.toFixed(2) }}</span>
        </div>
      </div>

      <!-- A Cuenta -->
      <div class="bg-white rounded-3xl p-5 shadow-sm shadow-gray-100/50 border border-blue-100/50 flex flex-col justify-between group overflow-hidden relative">
        <div class="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-2 mb-2 relative z-10">
          <span class="bg-blue-100 text-blue-600 p-1.5 rounded-xl text-lg shadow-sm">⚖️</span>
          <span class="text-xs font-black text-gray-500 uppercase tracking-widest">A Cuenta</span>
        </div>
        <div class="relative z-10">
          <span class="text-2xl font-black text-blue-600">S/ {{ searchSummary.acuenta.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Pendientes -->
      <div class="bg-white rounded-3xl p-5 shadow-sm shadow-gray-100/50 border border-orange-100/50 flex flex-col justify-between group overflow-hidden relative">
        <div class="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-2 mb-2 relative z-10">
          <span class="bg-orange-100 text-orange-600 p-1.5 rounded-xl text-lg shadow-sm">⏳</span>
          <span class="text-xs font-black text-gray-500 uppercase tracking-widest">Pendientes</span>
        </div>
        <div class="relative z-10">
          <span class="text-2xl font-black text-orange-600">S/ {{ searchSummary.pendiente.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-3xl shadow-sm shadow-gray-100/50 border border-gray-100/80 overflow-hidden relative z-10 flex flex-col">
      <div class="overflow-x-auto overflow-y-auto max-h-[65vh] w-full custom-scrollbar">
        <table class="w-full text-sm text-left whitespace-nowrap min-w-max">
          <thead class="text-xs text-gray-500 bg-gray-50/95 backdrop-blur-md uppercase tracking-wider sticky top-0 z-20 shadow-sm border-b border-gray-200">
            <tr>
              <th scope="col" class="px-6 py-5 font-black">ID / Cliente</th>
              <th scope="col" class="px-6 py-5 font-black">Fecha</th>
              <th scope="col" class="px-6 py-5 font-black">Detalle del Pedido</th>
              <th scope="col" class="px-6 py-5 font-black text-right">Total</th>
              <th scope="col" class="px-6 py-5 font-black text-center">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="pedido in filteredPedidos" :key="pedido.id_pedido" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4 relative">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <span class="font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200/50 shadow-sm text-xs">#{{ pedido.id_pedido }}</span>
                    <span v-if="pedido.es_canje" class="px-1.5 py-0.5 rounded-lg text-[9px] font-black bg-pink-100 text-pink-700 border border-pink-200 shadow-sm">🎁 Canje</span>
                  </div>
                  <span class="font-bold text-gray-800 text-sm truncate max-w-[200px] mt-1">{{ pedido.usuario || 'Sin nombre' }}</span>
                  <span class="text-[10px] text-gray-400 font-semibold truncate max-w-[200px]">{{ pedido.requisitos || 'Sin requisitos extras' }}</span>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <span class="text-sm opacity-60">📅</span> 
                  <span>{{ format(new Date(pedido.fecha), 'dd/MM/yyyy') }}<br><span class="text-[10px] text-gray-400 font-medium">{{ format(new Date(pedido.fecha), 'HH:mm') }}</span></span>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-col gap-1.5 min-w-[200px]">
                  <div v-for="(item, index) in pedido.detalle" :key="index" class="flex items-center gap-2 text-xs group/item">
                    <span class="font-black text-gray-600 bg-white border border-gray-100 px-1.5 py-0.5 rounded shadow-sm text-[11px]">x{{ item.cantidad }}</span>
                    <span class="font-semibold text-gray-700 truncate group-hover/item:text-pink-600 transition-colors">{{ item.sabor }}</span>
                    <span class="text-[10px] font-bold text-gray-400 ml-auto bg-gray-50 px-1.5 py-0.5 rounded">
                      {{ Number(item.subtotal) > 0 ? `S/ ${Number(item.subtotal).toFixed(2)}` : 'Gratis' }}
                    </span>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 text-right">
                <span class="font-black text-gray-900 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-100 shadow-inner inline-block text-base">
                  S/ {{ Number(pedido.total_pedido).toFixed(2) }}
                </span>
              </td>

              <td class="px-6 py-4 h-full">
                <div class="flex flex-col items-center justify-center gap-3 w-full h-full">
                  <span
                    class="px-3.5 py-1.5 text-[10px] font-black rounded-xl uppercase tracking-wider border shadow-sm w-[110px] text-center"
                    :class="{
                      'bg-orange-50 text-orange-600 border-orange-200': pedido.estado === 'pendiente',
                      'bg-green-50 text-green-600 border-green-200': pedido.estado === 'completado',
                      'bg-red-50 text-red-600 border-red-200': pedido.estado === 'cancelado',
                      'bg-blue-50 text-blue-600 border-blue-200': pedido.estado === 'porcobrar',
                      'bg-purple-50 text-purple-600 border-purple-200': pedido.estado === 'canje',
                      'bg-gray-50 text-gray-600 border-gray-200': pedido.estado === 'acuenta'
                    }"
                  >
                    {{ pedido.estado }}
                  </span>
                  <button
                    @click="openStatusModal(pedido)"
                    class="text-[10px] font-bold text-cyan-600 hover:text-white bg-cyan-50 hover:bg-cyan-500 px-3 py-1 rounded-lg transition-all shadow-sm border border-cyan-100 hover:border-cyan-500 active:scale-95 flex items-center justify-center gap-1.5 w-[110px]"
                  >
                    ✏️ Mover
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPedidos.length === 0">
              <td colspan="5" class="px-6 py-20 text-center">
                <div class="text-5xl mb-4 opacity-50 drop-shadow-sm">📋</div>
                <h3 class="text-xl font-black text-gray-800 tracking-tight">No se encontraron pedidos</h3>
                <p class="text-gray-500 font-medium text-sm mt-1">No hay elementos bajo este filtro</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Progreso de Clientes (Fidelidad) -->
    <div class="mt-12 mb-6">
      <div class="flex items-center gap-3 mb-6 animate-fade-in relative z-10">
        <h2 class="text-2xl font-black bg-linear-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent tracking-tight pb-1 flex items-center gap-2">
          <span class="text-3xl drop-shadow-sm filter-none text-black">👥</span> Fidelidad de Clientes
        </h2>
        <span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-xl text-xs font-black border border-amber-200">Top Clientes</span>
      </div>

      <div class="bg-white rounded-3xl shadow-sm shadow-gray-100/50 border border-gray-100/80 overflow-hidden relative z-10 flex flex-col">
        <div class="overflow-x-auto overflow-y-auto max-h-[500px] w-full custom-scrollbar">
          <table class="w-full text-sm text-left whitespace-nowrap min-w-max">
            <thead class="text-xs text-gray-500 bg-gray-50/95 backdrop-blur-md uppercase tracking-wider sticky top-0 z-20 shadow-sm border-b border-gray-200">
              <tr>
                <th scope="col" class="px-6 py-5 font-black">Cliente</th>
                <th scope="col" class="px-6 py-5 font-black text-center">Helados Comprados</th>
                <th scope="col" class="px-6 py-5 font-black text-center">Progreso Actual</th>
                <th scope="col" class="px-6 py-5 font-black text-center">A Canjear</th>
                <th scope="col" class="px-6 py-5 font-black text-right">Inversión Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(cliente, index) in clientsProgress" :key="cliente.usuario" class="hover:bg-gray-50/50 transition-colors group">
                <td class="px-6 py-4 relative">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-linear-to-tr from-pink-100 to-cyan-100 flex items-center justify-center text-sm font-black text-gray-600 shadow-sm">
                      <span v-if="index === 0">👑</span>
                      <span v-else-if="index === 1">🥈</span>
                      <span v-else-if="index === 2">🥉</span>
                      <span v-else>{{ cliente.usuario.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="font-bold text-gray-800 text-sm">{{ cliente.usuario }}</span>
                      <span class="text-[10px] text-gray-400 font-semibold mt-0.5">Últ. vez: {{ format(new Date(cliente.ultPedido), 'dd/MM/yyyy') }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="font-black text-gray-700 bg-gray-100 px-3 py-1 rounded-xl shadow-inner">{{ cliente.heladosComprados }} 🍦</span>
                </td>
                <td class="px-6 py-4 w-64">
                  <div class="flex flex-col gap-1.5 w-full">
                    <div class="flex justify-between items-center px-1">
                      <span class="text-[10px] font-black text-cyan-600 tracking-wider uppercase">{{ cliente.puntos }}/10</span>
                      <span class="text-[10px] font-bold text-gray-400 text-right">{{ cliente.faltan }} para canje</span>
                    </div>
                    <div class="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner border border-gray-200">
                      <div
                        class="bg-linear-to-r from-cyan-400 to-cyan-500 h-full rounded-full transition-all duration-500"
                        :style="{ width: `${(cliente.puntos / 10) * 100}%` }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    v-if="cliente.canjesDisponibles > 0"
                    class="px-3 py-1.5 bg-pink-100 text-pink-600 border border-pink-200 rounded-xl font-black text-xs shadow-sm animate-pulse inline-block"
                  >
                    ¡{{ cliente.canjesDisponibles }} Disponible(s)! 🎁
                  </span>
                  <span v-else class="text-gray-400 font-bold text-xs">—</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="font-black text-gray-900">S/ {{ cliente.totalGastado.toFixed(2) }}</span>
                </td>
              </tr>
              <tr v-if="clientsProgress.length === 0">
                <td colspan="5" class="px-6 py-16 text-center">
                  <p class="text-gray-500 font-bold">No hay clientes registrados con pedidos completados.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Status Change Modal -->
    <StatusModal
      v-if="selectedOrderId"
      :isOpen="isModalOpen"
      :currentStatus="selectedOrderStatus"
      :orderId="selectedOrderId"
      @close="isModalOpen = false"
      @save="handleStatusChange"
    />
  </main>
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
