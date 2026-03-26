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
    orders = orders.filter((p: any) => (p.usuario && p.usuario.toLowerCase().includes(q)) || p.id_pedido.toString().includes(q))
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

    if (p.es_canje && p.estado !== 'cancelado') {
      client.canjesUsados += 1
    } else if (!p.es_canje && p.estado === 'completado') {
      const cant = p.detalle?.reduce((sum: number, item: any) => sum + Number(item.cantidad), 0) || 0
      client.heladosComprados += cant
      client.totalGastado += Number(p.total_pedido) || 0
    }
  }

  return Array.from(map.values())
    .map((c) => {
      // Estimación de progreso local
      const heladosDisponibles = Math.max(0, c.heladosComprados - c.canjesUsados * 10)
      const puntos = heladosDisponibles % 10
      const canjesDisponibles = Math.floor(heladosDisponibles / 10)
      const faltan = 10 - puntos

      return {
        ...c,
        puntos,
        faltan,
        canjesDisponibles
      }
    })
    .sort((a, b) => {
      if (b.canjesDisponibles !== a.canjesDisponibles) return b.canjesDisponibles - a.canjesDisponibles
      if (b.puntos !== a.puntos) return b.puntos - a.puntos
      return b.totalGastado - a.totalGastado
    })
})
</script>

<template>
  <main class="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 pb-24">
    <div class="mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="animate-fade-in relative z-10 whitespace-nowrap">
        <h1 class="text-lg md:text-xl font-bold bg-linear-to-r from-pink-600 to-cyan-600 bg-clip-text text-transparent tracking-tight pb-0.5 flex items-center gap-1.5">
          <span class="text-xl drop-shadow-sm filter-none text-black">📋</span> Historial de Pedidos
        </h1>
        <p class="text-gray-400 mt-0.5 text-xs font-medium">Resumen general de pedidos del sistema.</p>
      </div>

      <div class="w-full md:max-w-xl flex flex-col sm:flex-row gap-2 relative animate-fade-in">
        <div class="relative w-full sm:w-1/3 shrink-0">
          <select
            v-model="currentFilter"
            class="w-full bg-white border border-gray-200 text-gray-700 text-xs rounded-lg outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300 p-2.5 transition-all shadow-sm font-bold appearance-none cursor-pointer pr-8"
          >
            <option v-for="f in filters" :key="f.value" :value="f.value">{{ f.label }}</option>
          </select>
          <div class="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <svg class="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <span class="text-gray-400 text-sm">🔍</span>
          </div>
          <input
            type="search"
            v-model="searchQuery"
            class="w-full bg-white border border-gray-200 text-gray-800 text-xs rounded-lg outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300 block pl-8 p-2.5 transition-all shadow-sm font-medium"
            placeholder="Buscar por cliente o ID..."
          />
        </div>
      </div>
    </div>

    <!-- Resumen Dinámico -->
    <div v-if="filteredPedidos.length > 0" class="mb-4 grid grid-cols-2 lg:grid-cols-4 gap-2.5 animate-fade-in relative z-10">
      <div class="bg-white rounded-xl p-3 shadow-sm border border-emerald-100/50 flex flex-col justify-between group overflow-hidden relative">
        <div class="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-1.5 mb-1.5 relative z-10">
          <span class="bg-emerald-100 text-emerald-600 p-1 rounded-lg text-sm">💰</span>
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Completados</span>
        </div>
        <div class="relative z-10">
          <span class="text-base font-bold text-emerald-600">S/ {{ searchSummary.completado.toFixed(2) }}</span>
        </div>
      </div>

      <div class="bg-white rounded-xl p-3 shadow-sm border border-red-100/50 flex flex-col justify-between group overflow-hidden relative">
        <div class="absolute inset-0 bg-linear-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-1.5 mb-1.5 relative z-10">
          <span class="bg-red-100 text-red-600 p-1 rounded-lg text-sm">🚨</span>
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Deuda Total</span>
        </div>
        <div class="relative z-10">
          <span class="text-base font-bold text-red-600">S/ {{ searchSummary.porcobrar.toFixed(2) }}</span>
        </div>
      </div>

      <div class="bg-white rounded-xl p-3 shadow-sm border border-blue-100/50 flex flex-col justify-between group overflow-hidden relative">
        <div class="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-1.5 mb-1.5 relative z-10">
          <span class="bg-blue-100 text-blue-600 p-1 rounded-lg text-sm">⚖️</span>
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">A Cuenta</span>
        </div>
        <div class="relative z-10">
          <span class="text-base font-bold text-blue-600">S/ {{ searchSummary.acuenta.toFixed(2) }}</span>
        </div>
      </div>

      <div class="bg-white rounded-xl p-3 shadow-sm border border-orange-100/50 flex flex-col justify-between group overflow-hidden relative">
        <div class="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-1.5 mb-1.5 relative z-10">
          <span class="bg-orange-100 text-orange-600 p-1 rounded-lg text-sm">⏳</span>
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pendientes</span>
        </div>
        <div class="relative z-10">
          <span class="text-base font-bold text-orange-600">S/ {{ searchSummary.pendiente.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100/80 overflow-hidden relative z-10 flex flex-col">
      <div class="overflow-x-auto overflow-y-auto max-h-[40vh] w-full custom-scrollbar">
        <table class="w-full text-xs text-left whitespace-nowrap min-w-max">
          <thead class="text-[10px] text-gray-500 bg-gray-50/95 uppercase tracking-wider sticky top-0 z-10 border-b border-gray-200">
            <tr>
              <th scope="col" class="px-4 py-3.5 font-bold">ID / Cliente</th>
              <th scope="col" class="px-4 py-3.5 font-bold">Fecha</th>
              <th scope="col" class="px-4 py-3.5 font-bold">Detalle del Pedido</th>
              <th scope="col" class="px-4 py-3.5 font-bold text-right">Total</th>
              <th scope="col" class="px-4 py-3.5 font-bold text-center">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <!-- Skeleton rows while loading -->
            <template v-if="store.loading">
              <tr v-for="i in 6" :key="i" class="animate-pulse">
                <td class="px-4 py-3.5">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex items-center gap-1.5">
                      <div class="h-4 w-10 bg-gray-200 rounded"></div>
                    </div>
                    <div class="h-3 w-32 bg-gray-100 rounded"></div>
                    <div class="h-2.5 w-24 bg-gray-100 rounded"></div>
                  </div>
                </td>
                <td class="px-4 py-3.5">
                  <div class="h-3 w-20 bg-gray-200 rounded"></div>
                  <div class="h-2.5 w-10 bg-gray-100 rounded mt-1"></div>
                </td>
                <td class="px-4 py-3.5">
                  <div class="flex flex-col gap-1.5 min-w-[180px]">
                    <div class="h-3 w-full bg-gray-200 rounded"></div>
                    <div class="h-3 w-3/4 bg-gray-100 rounded"></div>
                  </div>
                </td>
                <td class="px-4 py-3.5 text-right">
                  <div class="h-6 w-16 bg-gray-200 rounded-lg ml-auto"></div>
                </td>
                <td class="px-4 py-3.5">
                  <div class="flex flex-col items-center gap-1.5">
                    <div class="h-6 w-24 bg-gray-200 rounded-lg"></div>
                    <div class="h-5 w-24 bg-gray-100 rounded-md"></div>
                  </div>
                </td>
              </tr>
            </template>

            <template v-else>
              <tr v-for="pedido in filteredPedidos" :key="pedido.id_pedido" class="transition-colors group hover:bg-gray-50/70 border-l-2 border-l-transparent hover:border-l-pink-300">
                <td class="px-4 py-3 relative">
                  <div class="flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-[11px] border border-gray-200/50">#{{ pedido.id_pedido }}</span>
                      <span v-if="pedido.es_canje" class="px-1 py-0.5 rounded text-[8px] font-bold bg-pink-100 text-pink-700 border border-pink-200">🎁 Canje</span>
                    </div>
                    <span class="font-semibold text-gray-700 text-xs truncate max-w-[180px] mt-0.5 group-hover:text-gray-900 transition-colors">{{ pedido.usuario || 'Sin nombre' }}</span>
                    <span class="text-[10px] text-gray-400 font-medium truncate max-w-[180px]">{{ pedido.requisitos || 'Sin requisitos extras' }}</span>
                  </div>
                </td>

                <td class="px-4 py-3">
                  <div class="flex flex-col text-[11px] font-medium text-gray-500">
                    <span>{{ format(new Date(pedido.fecha), 'dd/MM/yyyy') }}</span>
                    <span class="text-[10px] text-gray-400 mt-0.5">{{ format(new Date(pedido.fecha), 'HH:mm') }}</span>
                  </div>
                </td>

                <td class="px-4 py-3">
                  <div class="flex flex-col gap-1 min-w-[180px]">
                    <div v-for="(item, index) in pedido.detalle" :key="index" class="flex items-center gap-1.5 text-[11px] group/item">
                      <span class="font-bold text-gray-600 bg-white border border-gray-100 px-1 py-0.5 rounded text-[10px]">x{{ item.cantidad }}</span>
                      <span class="font-medium text-gray-700 truncate group-hover/item:text-pink-600 transition-colors">{{ item.sabor }}</span>
                      <span class="text-[10px] font-medium text-gray-400 ml-auto bg-gray-50 px-1 py-0.5 rounded">
                        {{ Number(item.subtotal) > 0 ? `S/ ${Number(item.subtotal).toFixed(2)}` : 'Gratis' }}
                      </span>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-3 text-right">
                  <span
                    class="font-bold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 inline-block text-xs group-hover:bg-pink-50 group-hover:border-pink-100 group-hover:text-pink-800 transition-colors"
                  >
                    S/ {{ Number(pedido.total_pedido).toFixed(2) }}
                  </span>
                </td>

                <td class="px-4 py-3 h-full">
                  <div class="flex flex-col items-center justify-center gap-1.5 w-full h-full">
                    <span
                      class="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold rounded-lg uppercase tracking-wider border w-[100px] justify-center"
                      :class="{
                        'bg-orange-50 text-orange-600 border-orange-200': pedido.estado === 'pendiente',
                        'bg-green-50 text-green-600 border-green-200': pedido.estado === 'completado',
                        'bg-red-50 text-red-600 border-red-200': pedido.estado === 'cancelado',
                        'bg-blue-50 text-blue-600 border-blue-200': pedido.estado === 'porcobrar',
                        'bg-purple-50 text-purple-600 border-purple-200': pedido.estado === 'canje',
                        'bg-gray-50 text-gray-600 border-gray-200': pedido.estado === 'acuenta'
                      }"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full shrink-0"
                        :class="{
                          'bg-orange-400 animate-pulse': pedido.estado === 'pendiente',
                          'bg-green-400': pedido.estado === 'completado',
                          'bg-red-400': pedido.estado === 'cancelado',
                          'bg-blue-400': pedido.estado === 'porcobrar',
                          'bg-purple-400': pedido.estado === 'canje',
                          'bg-gray-400': pedido.estado === 'acuenta'
                        }"
                      ></span>
                      {{ pedido.estado }}
                    </span>
                    <button
                      @click="openStatusModal(pedido)"
                      class="text-[10px] font-bold text-cyan-600 hover:text-white bg-cyan-50 hover:bg-cyan-500 px-2 py-0.5 rounded-md transition-all border border-cyan-100 hover:border-cyan-500 active:scale-95 flex items-center justify-center gap-1 w-[100px]"
                    >
                      ✏️ Mover
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredPedidos.length === 0">
                <td colspan="5" class="px-4 py-12 text-center">
                  <div class="text-3xl mb-3 opacity-50">📋</div>
                  <h3 class="text-sm font-bold text-gray-800 tracking-tight">No se encontraron pedidos</h3>
                  <p class="text-gray-500 font-medium text-xs mt-0.5">No hay elementos bajo este filtro</p>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Progreso de Clientes (Fidelidad) -->
    <div class="mt-8 mb-4">
      <div class="flex items-center gap-2 mb-4 animate-fade-in relative z-10">
        <h2 class="text-base font-bold bg-linear-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent tracking-tight flex items-center gap-1.5">
          <span class="text-lg drop-shadow-sm filter-none text-black">👥</span> Fidelidad de Clientes
        </h2>
        <span class="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-amber-200">Top Clientes</span>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100/80 overflow-hidden relative z-10 flex flex-col">
        <div class="overflow-x-auto overflow-y-auto max-h-[30vh] w-full custom-scrollbar">
          <table class="w-full text-xs text-left whitespace-nowrap min-w-max">
            <thead class="text-[10px] text-gray-500 bg-gray-50/95 uppercase tracking-wider sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th scope="col" class="px-4 py-3.5 font-bold">Cliente</th>
                <th scope="col" class="px-4 py-3.5 font-bold text-center">Helados</th>
                <th scope="col" class="px-4 py-3.5 font-bold text-center">Progreso</th>
                <th scope="col" class="px-4 py-3.5 font-bold text-center">A Canjear</th>
                <th scope="col" class="px-4 py-3.5 font-bold text-right">Inversión</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <!-- Skeleton rows -->
              <template v-if="store.loading">
                <tr v-for="i in 5" :key="i" class="animate-pulse">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-gray-200"></div>
                      <div class="flex flex-col gap-1">
                        <div class="h-3 w-28 bg-gray-200 rounded"></div>
                        <div class="h-2.5 w-16 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <div class="h-5 w-16 bg-gray-200 rounded-lg mx-auto"></div>
                  </td>
                  <td class="px-4 py-3 w-48">
                    <div class="flex flex-col gap-1.5 w-full">
                      <div class="flex justify-between">
                        <div class="h-2.5 w-8 bg-gray-200 rounded"></div>
                        <div class="h-2.5 w-12 bg-gray-100 rounded"></div>
                      </div>
                      <div class="w-full bg-gray-100 h-1.5 rounded-full"></div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <div class="h-5 w-14 bg-gray-100 rounded-lg mx-auto"></div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="h-3 w-16 bg-gray-200 rounded ml-auto"></div>
                  </td>
                </tr>
              </template>

              <template v-else>
                <tr
                  v-for="(cliente, index) in clientsProgress"
                  :key="cliente.usuario"
                  class="transition-colors group hover:bg-gray-50/70 border-l-2 border-l-transparent hover:border-l-amber-300"
                >
                  <td class="px-4 py-3 relative">
                    <div class="flex items-center gap-2">
                      <div
                        class="w-7 h-7 rounded-full bg-linear-to-tr from-pink-100 to-cyan-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-white shadow-sm"
                      >
                        <span v-if="index === 0">👑</span>
                        <span v-else-if="index === 1">🥈</span>
                        <span v-else-if="index === 2">🥉</span>
                        <span v-else>{{ cliente.usuario.charAt(0).toUpperCase() }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-semibold text-gray-800 text-xs group-hover:text-gray-900 transition-colors">{{ cliente.usuario }}</span>
                        <span class="text-[10px] text-gray-400 font-medium">{{ format(new Date(cliente.ultPedido), 'dd/MM/yyyy') }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg text-[11px] border border-gray-200/50">{{ cliente.heladosComprados }} 🍦</span>
                  </td>
                  <td class="px-4 py-3 w-48">
                    <div class="flex flex-col gap-1 w-full">
                      <div class="flex justify-between items-center">
                        <span class="text-[10px] font-bold text-cyan-600">{{ cliente.puntos }}/10</span>
                        <span class="text-[10px] font-medium text-gray-400">{{ cliente.faltan }} faltan</span>
                      </div>
                      <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200/50">
                        <div class="bg-linear-to-r from-cyan-400 to-pink-400 h-full rounded-full transition-all duration-700" :style="{ width: `${(cliente.puntos / 10) * 100}%` }"></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span
                      v-if="cliente.canjesDisponibles > 0"
                      class="px-2 py-0.5 bg-pink-100 text-pink-600 border border-pink-200 rounded-lg font-bold text-[10px] animate-pulse inline-block"
                    >
                      ¡{{ cliente.canjesDisponibles }}! 🎁
                    </span>
                    <span v-else class="text-gray-300 font-medium text-[11px]">—</span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <span class="font-bold text-gray-900 text-xs group-hover:text-pink-700 transition-colors">S/ {{ cliente.totalGastado.toFixed(2) }}</span>
                  </td>
                </tr>
                <tr v-if="clientsProgress.length === 0">
                  <td colspan="5" class="px-4 py-10 text-center">
                    <p class="text-gray-500 font-medium text-xs">No hay clientes registrados con pedidos completados.</p>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div>
      <Imagen />
    </div>

    <!-- Status Change Modal -->
    <StatusModal v-if="selectedOrderId" :isOpen="isModalOpen" :currentStatus="selectedOrderStatus" :orderId="selectedOrderId" @close="isModalOpen = false" @save="handleStatusChange" />
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
