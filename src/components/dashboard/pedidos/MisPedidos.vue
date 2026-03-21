<script setup lang="ts">
import { useClientStore } from '@store/cliente'
import { format } from 'date-fns'

const clientStore = useClientStore()
</script>

<template>
  <div v-if="clientStore.pedidos.length > 0" class="mb-10 mt-6 relative z-10">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 px-1">
      <h2 class="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
        <span class="text-2xl drop-shadow-sm">🛍️</span> Historial de Pedidos
      </h2>
      <span class="bg-pink-100 text-pink-700 font-black text-xs px-3.5 py-1.5 rounded-xl border border-pink-200 shadow-sm self-start sm:self-auto flex items-center gap-1.5">
        <span>{{ clientStore.pedidos.length }}</span> pedidos totales
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <div v-for="pedido in clientStore.pedidos" :key="pedido.id_pedido" class="group bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-3xl shadow-sm shadow-gray-100/50 border border-gray-100/80 hover:shadow-xl hover:shadow-pink-100/50 hover:border-pink-200 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col h-full">
        <!-- Floating decos -->
        <div class="absolute -right-6 -top-6 w-28 h-28 bg-linear-to-bl from-gray-50 to-transparent rounded-bl-full opacity-60 transition-transform group-hover:scale-125 group-hover:from-pink-50 duration-500"></div>

        <div class="relative z-10 flex justify-between items-start mb-5">
          <div class="pr-2">
            <div class="flex items-center gap-2.5 mb-2.5 flex-wrap">
              <span class="text-xs font-black text-gray-800 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm">#{{ pedido.id_pedido }}</span>
              <span
                class="px-2.5 py-1 text-[10px] sm:text-[9px] font-black rounded-lg uppercase tracking-wider border shadow-sm"
                :class="{
                  'bg-orange-50 text-orange-600 border-orange-200 animate-pulse': pedido.estado === 'pendiente',
                  'bg-green-50 text-green-600 border-green-200': pedido.estado === 'completado',
                  'bg-red-50 text-red-600 border-red-200': pedido.estado === 'cancelado',
                  'bg-blue-50 text-blue-600 border-blue-200': pedido.estado === 'porcobrar',
                  'bg-purple-50 text-purple-600 border-purple-200': pedido.estado === 'canje',
                  'bg-gray-50 text-gray-600 border-gray-200': pedido.estado === 'acuenta'
                }"
              >
                {{ pedido.estado }}
              </span>
            </div>
            <p class="text-xs font-bold text-gray-400 flex items-center gap-1.5"><span class="opacity-60 text-sm">📅</span> {{ format(new Date(pedido.fecha), 'dd/MM/yyyy • HH:mm') }}</p>
          </div>
          
          <!-- Icon depending on status -->
          <div class="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-xl shadow-inner border-[3px] border-white transition-transform group-hover:scale-110 group-hover:rotate-3"
               :class="pedido.estado === 'pendiente' ? 'bg-orange-100 shadow-orange-200/50 text-orange-600' : 'bg-gray-50 shadow-gray-100 text-gray-500'">
            <span v-if="pedido.estado === 'pendiente'">⏳</span>
            <span v-else-if="pedido.estado === 'completado'">✅</span>
            <span v-else-if="pedido.estado === 'cancelado'">❌</span>
            <span v-else-if="pedido.estado === 'porcobrar'">💳</span>
            <span v-else-if="pedido.estado === 'canje'">🎁</span>
            <span v-else>📦</span>
            
            <span v-if="pedido.estado === 'pendiente'" class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500 border-2 border-white"></span>
            </span>
          </div>
        </div>

        <div class="bg-gray-50/80 rounded-2xl p-3 border border-gray-100/50 space-y-2 mb-5 flex-1 relative z-10">
          <div v-for="x in pedido.detalle" :key="x.sabor" class="flex items-center gap-3 text-sm sm:text-xs group/item">
            <span class="w-2 h-2 rounded-full bg-gray-300 group-hover/item:bg-pink-400 transition-colors shadow-sm"></span>
            <span class="text-gray-700 font-semibold truncate flex-1 tracking-tight">{{ x.sabor }}</span>
            <span class="text-gray-600 font-black bg-white px-2.5 py-1 rounded-lg shadow-sm border border-gray-100 text-[11px]">x{{ x.cantidad }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 shadow-inner mt-auto relative z-10 group-hover:bg-pink-50/30 group-hover:border-pink-100 transition-colors">
          <span class="text-[11px] text-gray-500 font-black uppercase tracking-widest group-hover:text-pink-600 transition-colors">Total</span>
          <span class="text-lg sm:text-base font-black text-gray-900 group-hover:text-pink-700 transition-colors">S/ {{ pedido.total_pedido }} </span>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="text-center py-20 px-4 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-gray-100/50 shadow-sm mt-8 max-w-2xl mx-auto">
    <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-inner border-4 border-white">👀</div>
    <h3 class="text-xl font-black text-gray-800 tracking-tight">Aún no tienes pedidos</h3>
    <p class="text-sm text-gray-500 mt-2 font-medium">¡Anímate a realizar tu primera compra y empieza a sumar puntos para tus premios gratis!</p>
  </div>
</template>
