<template>
  <div data-slot="card" class="text-card-foreground flex flex-col gap-3 p-4 shadow-sm border border-gray-100 rounded-xl bg-white mt-2">
    <h3 class="text-sm font-black text-gray-800 mb-1">Últimas Compras</h3>
    <div class="space-y-2">
      <div
        v-for="pedido in store.pedidos.slice(0, 5)"
        :key="pedido.id_pedido"
        class="flex justify-between items-center p-2.5 rounded-lg border border-gray-50 hover:border-gray-100 hover:shadow-sm transition-all bg-white"
      >
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-lg shadow-sm border border-gray-100">
            <span v-if="pedido.estado === 'pendiente'">⏳</span>
            <span v-else-if="pedido.estado === 'completado'">✅</span>
            <span v-else-if="pedido.estado === 'cancelado'">❌</span>
            <span v-else-if="pedido.estado === 'porcobrar'">💳</span>
            <span v-else-if="pedido.estado === 'canje'">🎁</span>
            <span v-else>📦</span>
          </div>

          <div>
            <div class="flex items-center gap-1.5 mb-0.5">
              <span class="text-xs font-bold text-gray-800">#{{ pedido.id_pedido }}</span>
              <span
                class="px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider scale-90 origin-left"
                :class="{
                  'status-pendiente': pedido.estado === 'pendiente',
                  'status-completado': pedido.estado === 'completado',
                  'status-cancelado': pedido.estado === 'cancelado',
                  'status-porcobrar': pedido.estado === 'porcobrar',
                  'status-canje': pedido.estado === 'canje'
                }"
              >
                {{ pedido.estado }}
              </span>
            </div>
            <p class="text-[10px] text-gray-400 font-medium">{{ format(new Date(pedido.fecha), 'dd/MM/yyyy') }}</p>
          </div>
        </div>

        <div class="text-right">
          <span class="text-xs font-black text-gray-800 block"> S/ {{ pedido.total_pedido }} </span>
        </div>
      </div>

      <div v-if="store.pedidos.length === 0" class="text-center py-6 text-gray-400 text-xs italic">No tienes compras recientes</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClientStore } from '@store/cliente'
import { format } from 'date-fns'

const store = useClientStore()
</script>
