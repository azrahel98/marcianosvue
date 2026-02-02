<script setup lang="ts">
import { useClientStore } from '@store/cliente'

const clientStore = useClientStore()
</script>

<template>
  <div v-if="clientStore.pedidos.length > 0" class="mb-8">
    <h2 class="text-lg font-black text-gray-800 mb-4">Mis Pedidos</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="pedido in clientStore.pedidos" :key="pedido.id" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start mb-2">
          <div>
            <p class="text-xs font-bold text-gray-500 uppercase">Pedido #{{ pedido.id }}</p>
            <p class="text-sm font-medium text-gray-800">{{ new Date(pedido.fecha).toLocaleDateString() }}</p>
          </div>
          <span
            class="px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider"
            :class="{
              'bg-yellow-100 text-yellow-600': pedido.estado === 'pendiente',
              'bg-green-100 text-green-600': pedido.estado === 'completado',
              'bg-red-100 text-red-600': pedido.estado === 'cancelado'
            }"
          >
            {{ pedido.estado }}
          </span>
        </div>
        <div class="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
          <span class="text-xs text-gray-500 font-medium">Nombre</span>
          <span class="text-xs font-medium text-gray-800"> {{ pedido.marciano }} </span>
        </div>
        <div class="border-t border-gray-50 flex justify-between items-center">
          <span class="text-xs text-gray-500 font-medium">Cantidad</span>
          <span class="text-xs font-medium text-gray-800"> {{ pedido.cantidad }} </span>
        </div>

        <div class="border-t border-gray-50 flex justify-between items-center">
          <span class="text-xs text-gray-500 font-medium">Precio</span>
          <span class="text-xs font-medium text-gray-800"> {{ pedido.precio }} </span>
        </div>

        <div class="border-t border-gray-50 flex justify-between items-center">
          <span class="text-xs text-gray-500 font-medium">Total</span>
          <span class="text-base font-black text-gray-800">S/ {{ pedido.precio * pedido.cantidad }} </span>
        </div>
      </div>
    </div>
  </div>
</template>
