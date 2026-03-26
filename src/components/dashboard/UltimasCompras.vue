<template>
  <div data-slot="card" class="text-card-foreground flex flex-col gap-4 p-4 sm:p-5 shadow-sm shadow-gray-100/50 border border-gray-100/80 rounded-2xl bg-white/90 backdrop-blur-md mt-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-bold text-gray-700 flex items-center gap-1.5">
        <span class="text-base">🧾</span> Últimas Compras
      </h3>
      <RouterLink to="/pedidos" class="text-[11px] font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg transition-colors">
        Ver todo →
      </RouterLink>
    </div>

    <!-- Skeleton loading -->
    <div v-if="store.loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="flex items-start gap-3">
        <div class="w-8 h-8 shrink-0 rounded-full bg-gray-200 animate-pulse"></div>
        <div class="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-2">
          <div class="flex justify-between items-start">
            <div class="space-y-1.5">
              <div class="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-2.5 w-16 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div class="h-6 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div class="bg-gray-100/80 rounded-lg p-2 space-y-1.5">
            <div class="h-2.5 w-full bg-gray-200 rounded animate-pulse"></div>
            <div class="h-2.5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="relative space-y-3 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-gray-200 before:via-gray-100 before:to-transparent">

      <div
        v-for="(pedido) in store.pedidos.slice(0, 5)"
        :key="pedido.id_pedido"
        class="relative flex items-start gap-3 group"
      >
        <!-- Timeline Icon -->
        <div class="relative z-10 w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm shadow-sm border-3 border-white transition-transform group-hover:scale-110"
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

        <!-- Content Card -->
        <div class="flex-1 min-w-0 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group-hover:-translate-y-0.5">
           <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-2.5">
             <div>
               <div class="flex items-center gap-2 mb-1 flex-wrap">
                 <span class="text-xs font-bold text-gray-800">Pedido #{{ pedido.id_pedido }}</span>
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
               <div class="flex items-center text-[11px] text-gray-400 font-medium">
                 <span class="mr-1 opacity-70 text-xs">📅</span> {{ format(new Date(pedido.fecha), 'dd/MM/yyyy') }}
               </div>
             </div>

             <div class="text-left sm:text-right">
               <span class="text-xs font-bold text-gray-900 inline-block bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100"> S/ {{ pedido.total_pedido }} </span>
             </div>
           </div>

           <div class="bg-gray-50/80 rounded-lg p-2 border border-gray-100/50 space-y-1">
             <div v-for="x in pedido.detalle" :key="x.sabor" class="flex items-center gap-2 text-xs group/item">
                <span class="w-1 h-1 rounded-full bg-gray-300 group-hover/item:bg-pink-400 transition-colors"></span>
                <span class="text-gray-600 font-medium truncate flex-1">{{ x.sabor }}</span>
                <span class="text-gray-500 font-bold bg-white px-1.5 py-0.5 rounded text-[11px] border border-gray-100">x{{ x.cantidad }}</span>
             </div>
           </div>
        </div>
      </div>

      <div v-if="store.pedidos.length === 0" class="text-center py-6 text-gray-400 text-xs font-medium italic border-2 border-dashed border-gray-100 rounded-xl">
        No tienes compras recientes 👀
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClientStore } from '@store/cliente'
import { format } from 'date-fns'

const store = useClientStore()
</script>
