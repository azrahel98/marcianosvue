<script setup lang="ts">
import { computed } from 'vue'
import Progreso from '@comp/dashboard/Progreso.vue'
import UltimasCompras from '@comp/dashboard/UltimasCompras.vue'
import { useClientStore } from '@store/cliente'
import { userStore } from '@store/user'
import Main from '@comp/dashboard/admin/main.vue'

const clientStore = useClientStore()
const user = userStore()

const faltan = computed(() => clientStore.pedido?.faltan_para_el_proximo ?? 0)
const comprasCount = computed(() => clientStore.pedidos.length)
</script>

<template>
  <Main v-if="user.isAdmin" />
  <div v-else class="max-w-5xl w-full mx-auto px-4 sm:px-8 py-6">
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div class="animate-fade-in flex items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-linear-to-tr from-pink-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-pink-200 border-2 border-white">
          {{ user.nombre?.charAt(0) || 'U' }}
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-black bg-linear-to-r from-pink-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">¡Hola, {{ user.nombre }}!</h1>
          <div class="flex items-center gap-2 mt-1 flex-wrap">
            <span class="bg-pink-100 text-pink-700 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm border border-pink-200/50">
              🔥 Cliente frecuente
            </span>
            <p class="text-gray-500 text-sm font-medium">✨ Tu día es más dulce hoy.</p>
          </div>
        </div>
      </div>
      <RouterLink to="/perfil" class="mt-3 sm:mt-0 flex items-center gap-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 hover:text-gray-800 hover:shadow-sm transition-all shadow-sm cursor-pointer ml-18 sm:ml-0 active:scale-95">
        <span class="text-base">👤</span> Ver perfil
      </RouterLink>
    </div>

    <!-- Gamification Banner -->
    <div v-if="faltan > 0 && faltan <= 3" class="mb-6 bg-linear-to-r from-pink-500 to-pink-600 rounded-3xl p-4 sm:p-5 text-white shadow-lg shadow-pink-200 flex items-center gap-4 border border-pink-400 relative overflow-hidden group cursor-default hover:scale-[1.01] transition-transform">
      <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      <div class="text-4xl drop-shadow-md relative z-10 animate-bounce">🎯</div>
      <div class="flex-1 relative z-10">
        <h4 class="font-black text-lg leading-tight tracking-tight">¡Estás muy cerca!</h4>
        <p class="text-sm font-medium text-pink-100 mt-0.5">Te faltan solo <span class="text-white font-black bg-white/20 px-1.5 py-0.5 rounded-md">{{ faltan }}</span> para tu premio gratis.</p>
      </div>
    </div>

    <Progreso />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 mt-6">
      <div
        data-slot="card"
        class="group relative text-card-foreground flex flex-col justify-between p-5 sm:p-6 shadow-sm shadow-pink-100/50 border border-pink-50 rounded-3xl bg-white hover:border-pink-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden min-h-[140px]"
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-pink-50 to-transparent rounded-bl-full opacity-60 transition-transform group-hover:scale-125 duration-500"></div>
        <RouterLink to="/pedidos" class="relative z-10 h-full flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <div class="p-3 bg-pink-50 rounded-2xl text-pink-500 group-hover:bg-pink-100 group-hover:text-pink-600 transition-colors shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 1 2 2h14a2 2 0 0 1 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <span class="text-sm font-black text-pink-600 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-pink-100">{{ clientStore.pedidos.length }}</span>
          </div>

          <div class="mt-4 flex items-end justify-between">
            <div>
              <h3 class="text-base font-black text-gray-800 group-hover:text-pink-600 transition-colors mb-0.5">Mis Pedidos</h3>
              <p class="text-xs text-gray-500 font-medium">Ver historial completo</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </RouterLink>
      </div>

      <div
        data-slot="card"
        class="group relative text-card-foreground flex flex-col justify-between p-5 sm:p-6 shadow-sm shadow-cyan-100/50 border border-cyan-50 rounded-3xl bg-white hover:border-cyan-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden min-h-[140px]"
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-cyan-50 to-transparent rounded-bl-full opacity-60 transition-transform group-hover:scale-125 duration-500"></div>

        <a class="relative z-10 h-full flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <div class="p-3 bg-cyan-50 rounded-2xl text-cyan-500 group-hover:bg-cyan-100 group-hover:text-cyan-600 transition-colors shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="M12 8v13" />
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
              </svg>
            </div>
            <span class="text-sm font-black text-cyan-600 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-cyan-100">{{ clientStore.pedido.canjes_disponibles ?? 0 }}</span>
          </div>

          <div class="mt-4 flex items-end justify-between">
            <div>
              <h3 class="text-base font-black text-gray-800 group-hover:text-cyan-600 transition-colors mb-0.5">Canjeables</h3>
              <p class="text-xs text-gray-500 font-medium">Premios disponibles</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-500 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </a>
      </div>
    </div>

    <UltimasCompras />

    <!-- Gamification Achievements -->
    <div class="mt-8 mb-4">
      <h3 class="text-lg font-black text-gray-800 flex items-center gap-2 mb-4 px-1">
        <span class="text-xl">🏅</span> Mis Logros
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-3xl border border-gray-100/80 shadow-sm flex flex-col items-center text-center gap-2 hover:shadow-md hover:border-gray-200 hover:-translate-y-1 transition-all cursor-default">
          <div class="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-3xl shadow-inner drop-shadow-sm">⭐</div>
          <div>
            <h4 class="font-black text-gray-800 text-sm">Primer Canje</h4>
            <p class="text-[10px] text-emerald-600 font-black mt-0.5 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">Completado</p>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-3xl border border-gray-100/80 shadow-sm flex flex-col items-center text-center gap-2 hover:shadow-md hover:border-gray-200 hover:-translate-y-1 transition-all cursor-default"
             :class="comprasCount >= 5 ? '' : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100'">
          <div class="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-3xl shadow-inner drop-shadow-sm">🔥</div>
          <div>
            <h4 class="font-black text-gray-800 text-sm">Racha x5</h4>
            <p class="text-[10px] font-black mt-0.5 px-2 py-0.5 rounded-md uppercase" :class="comprasCount >= 5 ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 bg-gray-50'">
              {{ comprasCount >= 5 ? 'Completado' : `${comprasCount}/5 compras` }}
            </p>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-3xl border border-gray-100/80 shadow-sm flex flex-col items-center text-center gap-2 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:shadow-md hover:border-gray-200 hover:-translate-y-1 transition-all cursor-default">
          <div class="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-3xl shadow-inner drop-shadow-sm">🧊</div>
          <div>
            <h4 class="font-black text-gray-800 text-sm">Rey Helado</h4>
            <p class="text-[10px] text-gray-500 font-black mt-0.5 bg-gray-50 px-2 py-0.5 rounded-md uppercase">Lvl. 10 req.</p>
          </div>
        </div>
        
        <div class="bg-white p-4 rounded-3xl border border-gray-100/80 shadow-sm flex flex-col items-center text-center gap-2 hover:shadow-md hover:border-gray-200 hover:-translate-y-1 transition-all cursor-default">
          <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-3xl shadow-inner drop-shadow-sm">🌱</div>
          <div>
            <h4 class="font-black text-gray-800 text-sm">Iniciativa</h4>
            <p class="text-[10px] text-emerald-600 font-black mt-0.5 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">Completado</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
