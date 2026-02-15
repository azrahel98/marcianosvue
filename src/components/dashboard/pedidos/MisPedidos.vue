<script setup lang="ts">
import { useClientStore } from '@store/cliente'
import { format } from 'date-fns'

const clientStore = useClientStore()
</script>

<template>
  <div v-if="clientStore.pedidos.length > 0" class="mb-8 mt-4">
    <h2 class="text-base font-bold text-gray-800 mb-3 tracking-tight">Mis Pedidos - {{ clientStore.pedidos.length }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      <div v-for="pedido in clientStore.pedidos" :key="pedido.id_pedido" class="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start mb-2">
          <div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[10px] font-bold text-gray-500 uppercase">#{{ pedido.id_pedido }}</span>
              <span
                class="px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider"
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
            <p class="text-xs font-semibold text-gray-800 mt-1">{{ format(pedido.fecha, 'dd/MM/yyyy') }}</p>
          </div>
        </div>

        <div class="h-px bg-gray-50 my-2"></div>

        <div v-for="x in pedido.detalle" :key="x.sabor" class="flex justify-between items-center">
          <span class="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{{ x.sabor }}</span>
          <span class="text-xs font-medium text-gray-800"> {{ x.cantidad }} </span>
        </div>

        <div class="flex justify-between items-center mt-1">
          <span class="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Total</span>
          <span class="text-sm font-black text-gray-900">S/ {{ pedido.total_pedido }} </span>
        </div>
      </div>
    </div>
  </div>
</template>
