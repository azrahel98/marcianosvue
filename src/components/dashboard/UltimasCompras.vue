<template>
  <div data-slot="card" class="text-card-foreground flex flex-col gap-4 p-5 shadow-sm border border-gray-200 rounded-2xl bg-white">
    <h3 class="text-lg font-black text-gray-800 mb-2">Últimas Compras</h3>
    <div class="space-y-3">
      <div
        v-for="pedido in store.pedidos"
        :key="pedido.id"
        class="flex justify-between items-center p-3 rounded-xl border transition-all hover:shadow-md"
        :class="statusConfig[pedido.estado]?.bg || 'bg-gray-50 border-gray-100'"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm" :class="statusConfig[pedido.estado]?.iconBg || 'bg-gray-200'">
            {{ statusConfig[pedido.estado]?.icon || '📦' }}
          </div>

          <div>
            <p class="font-bold text-gray-900 text-sm capitalize">
              {{ pedido.estado === 'porcobrar' ? 'Por Cobrar' : pedido.estado }}
            </p>
            <p class="text-[10px] text-gray-500 font-medium">{{ format(new Date(pedido.fecha), 'dd/MM/yyyy') }}</p>
          </div>
        </div>

        <div class="text-right">
          <span class="text-xs font-black px-2 py-1 rounded-md shadow-sm border block" :class="statusConfig[pedido.estado]?.badge || 'text-gray-600 bg-white border-gray-200'">
            S/ {{ pedido.total_pedido }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClientStore } from '@store/cliente'
import { format } from 'date-fns'

const store = useClientStore()

// Configuración de estilos por estado
const statusConfig: Record<string, any> = {
  pendiente: {
    bg: 'bg-linear-to-r from-orange-50 to-white border-orange-100',
    iconBg: 'bg-orange-100',
    icon: '⏳',
    badge: 'text-orange-600 bg-white border-orange-100'
  },
  completado: {
    bg: 'bg-linear-to-r from-green-50 to-white border-green-100',
    iconBg: 'bg-green-100',
    icon: '✅',
    badge: 'text-green-600 bg-white border-green-100'
  },
  cancelado: {
    bg: 'bg-linear-to-r from-red-50 to-white border-red-100',
    iconBg: 'bg-red-100',
    icon: '❌',
    badge: 'text-red-600 bg-white border-red-100'
  },
  porcobrar: {
    bg: 'bg-linear-to-r from-blue-50 to-white border-blue-100',
    iconBg: 'bg-blue-100',
    icon: '💳',
    badge: 'text-blue-600 bg-white border-blue-100'
  },
  canje: {
    bg: 'bg-linear-to-r from-purple-50 to-white border-purple-100',
    iconBg: 'bg-purple-100',
    icon: '🎁',
    badge: 'text-purple-600 bg-white border-purple-100'
  }
}
</script>
