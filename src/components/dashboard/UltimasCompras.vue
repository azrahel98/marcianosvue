<template>
  <div data-slot="card" class="text-card-foreground flex flex-col gap-6 p-6 sm:p-7 shadow-sm shadow-gray-100/50 border border-gray-100/80 rounded-3xl bg-white/90 backdrop-blur-md mt-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-black text-gray-800 flex items-center gap-2">
        <span class="text-xl">🧾</span> Últimas Compras
      </h3>
      <RouterLink to="/pedidos" class="text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-xl transition-colors">
        Ver todo →
      </RouterLink>
    </div>

    <div class="relative space-y-6 before:absolute before:inset-0 before:ml-[1.4rem] sm:before:ml-[1.2rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-gray-200 before:via-gray-100 before:to-transparent">
      
      <div
        v-for="(pedido) in store.pedidos.slice(0, 5)"
        :key="pedido.id_pedido"
        class="relative flex items-start gap-4 sm:gap-6 group"
      >
        <!-- Timeline Icon -->
        <div class="relative z-10 w-11 h-11 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center text-xl sm:text-lg shadow-sm border-4 border-white transition-transform group-hover:scale-110"
             :class="pedido.estado === 'pendiente' ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-500'">
            <span v-if="pedido.estado === 'pendiente'">⏳</span>
            <span v-else-if="pedido.estado === 'completado'">✅</span>
            <span v-else-if="pedido.estado === 'cancelado'">❌</span>
            <span v-else-if="pedido.estado === 'porcobrar'">💳</span>
            <span v-else-if="pedido.estado === 'canje'">🎁</span>
            <span v-else>📦</span>
            
            <!-- Pulsing dot for pending -->
            <span v-if="pedido.estado === 'pendiente'" class="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500 border-2 border-white"></span>
            </span>
        </div>

        <!-- Content Card -->
        <div class="flex-1 min-w-0 bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all group-hover:-translate-y-1">
           <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
             <div>
               <div class="flex items-center gap-3 mb-1.5 flex-wrap">
                 <span class="text-sm font-black text-gray-800">Pedido #{{ pedido.id_pedido }}</span>
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
               <div class="flex items-center text-xs text-gray-500 font-medium">
                 <span class="mr-1.5 opacity-70">📅</span> {{ format(new Date(pedido.fecha), 'dd/MM/yyyy') }}
               </div>
             </div>
             
             <div class="text-left sm:text-right">
               <span class="text-base sm:text-sm font-black text-gray-900 inline-block bg-gray-50 px-3.5 py-1.5 rounded-xl border border-gray-100 shadow-inner"> S/ {{ pedido.total_pedido }} </span>
             </div>
           </div>

           <div class="bg-gray-50/80 rounded-2xl p-3 border border-gray-100/50 space-y-1.5">
             <div v-for="x in pedido.detalle" :key="x.sabor" class="flex items-center gap-2.5 text-sm sm:text-xs group/item">
                <span class="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-pink-400 transition-colors"></span>
                <span class="text-gray-700 font-semibold truncate flex-1">{{ x.sabor }}</span>
                <span class="text-gray-500 font-black bg-white px-2.5 py-1 rounded-lg shadow-sm border border-gray-100">x{{ x.cantidad }}</span>
             </div>
           </div>
        </div>
      </div>

      <div v-if="store.pedidos.length === 0" class="text-center py-8 text-gray-400 text-sm font-medium italic border-2 border-dashed border-gray-100 rounded-2xl">
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
