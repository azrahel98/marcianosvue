<script setup lang="ts">
import { useClientStore } from '@store/cliente'
import { format } from 'date-fns'

const clientStore = useClientStore()
</script>

<template>
  <!-- Skeleton loading -->
  <div v-if="clientStore.loading" class="mb-6 mt-4 relative z-10">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 px-1">
      <div class="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
      <div class="h-6 w-24 bg-gray-100 rounded-lg animate-pulse"></div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      <div v-for="i in 8" :key="i" class="bg-white/90 p-3.5 rounded-xl shadow-sm border border-gray-100/80 flex flex-col gap-3 h-44">
        <div class="flex justify-between items-start">
          <div class="space-y-1.5">
            <div class="flex gap-1.5">
              <div class="h-5 w-14 bg-gray-200 rounded-md animate-pulse"></div>
              <div class="h-5 w-16 bg-gray-100 rounded-md animate-pulse"></div>
            </div>
            <div class="h-3 w-28 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div class="w-9 h-9 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
        <div class="bg-gray-50 rounded-lg p-2 border border-gray-100/50 flex-1 space-y-1.5">
          <div class="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
          <div class="h-3 w-4/5 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div class="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex justify-between">
          <div class="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-4 w-14 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="clientStore.pedidos.length > 0" class="mb-6 mt-4 relative z-10">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 px-1">
      <h2 class="text-sm font-bold text-gray-700 tracking-tight flex items-center gap-1.5">
        <span class="text-base">🛍️</span> Historial de Pedidos
      </h2>
      <span class="bg-pink-100 text-pink-700 font-bold text-[11px] px-2.5 py-1 rounded-lg border border-pink-200 self-start sm:self-auto flex items-center gap-1">
        <span>{{ clientStore.pedidos.length }}</span> pedidos totales
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      <div v-for="pedido in clientStore.pedidos" :key="pedido.id_pedido" class="group bg-white/90 backdrop-blur-sm p-3 sm:p-3.5 rounded-xl shadow-sm shadow-gray-100/50 border border-gray-100/80 hover:shadow-md hover:shadow-pink-100/50 hover:border-pink-200 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden flex flex-col h-full">
        <div class="absolute -right-4 -top-4 w-20 h-20 bg-linear-to-bl from-gray-50 to-transparent rounded-bl-full opacity-60 transition-transform group-hover:scale-125 group-hover:from-pink-50 duration-500"></div>

        <div class="relative z-10 flex justify-between items-start mb-3">
          <div class="pr-2">
            <div class="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span class="text-[11px] font-bold text-gray-800 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">#{{ pedido.id_pedido }}</span>
              <span
                class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider border"
                :class="{
                  'bg-orange-50 text-orange-600 border-orange-200': pedido.estado === 'pendiente',
                  'bg-green-50 text-green-600 border-green-200': pedido.estado === 'completado',
                  'bg-red-50 text-red-600 border-red-200': pedido.estado === 'cancelado',
                  'bg-blue-50 text-blue-600 border-blue-200': pedido.estado === 'porcobrar',
                  'bg-purple-50 text-purple-600 border-purple-200': pedido.estado === 'canje',
                  'bg-gray-50 text-gray-600 border-gray-200': pedido.estado === 'acuenta'
                }"
              >
                <span class="w-1.5 h-1.5 rounded-full shrink-0"
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
            </div>
            <p class="text-[11px] font-medium text-gray-400 flex items-center gap-1"><span class="opacity-60 text-xs">📅</span> {{ format(new Date(pedido.fecha), 'dd/MM/yyyy • HH:mm') }}</p>
          </div>

          <div class="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-sm border-2 border-white transition-transform group-hover:scale-110"
               :class="pedido.estado === 'pendiente' ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-500'">
            <span v-if="pedido.estado === 'pendiente'">⏳</span>
            <span v-else-if="pedido.estado === 'completado'">✅</span>
            <span v-else-if="pedido.estado === 'cancelado'">❌</span>
            <span v-else-if="pedido.estado === 'porcobrar'">💳</span>
            <span v-else-if="pedido.estado === 'canje'">🎁</span>
            <span v-else>📦</span>

            <span v-if="pedido.estado === 'pendiente'" class="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500 border border-white"></span>
            </span>
          </div>
        </div>

        <div class="bg-gray-50/80 rounded-lg p-2 border border-gray-100/50 space-y-1 mb-3 flex-1 relative z-10">
          <div v-for="x in pedido.detalle" :key="x.sabor" class="flex items-center gap-2 text-xs group/item">
            <span class="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-pink-400 transition-colors"></span>
            <span class="text-gray-600 font-medium truncate flex-1">{{ x.sabor }}</span>
            <span class="text-gray-500 font-bold bg-white px-1.5 py-0.5 rounded text-[10px] border border-gray-100">x{{ x.cantidad }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 mt-auto relative z-10 group-hover:bg-pink-50/30 group-hover:border-pink-100 transition-colors">
          <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-pink-600 transition-colors">Total</span>
          <span class="text-sm font-bold text-gray-900 group-hover:text-pink-700 transition-colors">S/ {{ pedido.total_pedido }} </span>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-12 px-4 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-100/50 shadow-sm mt-6 max-w-xl mx-auto">
    <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-3 border-white">👀</div>
    <h3 class="text-base font-bold text-gray-800 tracking-tight">Aún no tienes pedidos</h3>
    <p class="text-xs text-gray-500 mt-1.5 font-medium">¡Anímate a realizar tu primera compra y empieza a sumar puntos!</p>
  </div>
</template>
