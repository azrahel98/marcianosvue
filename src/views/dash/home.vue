<script setup lang="ts">
import Progreso from '@comp/dashboard/Progreso.vue'
import UltimasCompras from '@comp/dashboard/UltimasCompras.vue'
import { onMounted } from 'vue'
import { useClientStore } from '@store/cliente'
import { userStore } from '@store/user'
import Main from '@comp/dashboard/admin/main.vue'
import { useSaboresStore } from '@store/sabores'

const clientStore = useClientStore()
const user = userStore()
const saboresStore = useSaboresStore()

onMounted(async () => {
  if (!user.isAdmin) {
    await clientStore.fetchClientData()
  } else {
    await Promise.all([clientStore.pedidos_admin(), saboresStore.fetchSabores()])
  }
})
</script>

<template>
  <Main v-if="user.isAdmin" />
  <main v-else class="max-w-5xl w-full mx-auto px-4 sm:px-6 py-4">
    <div class="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div>
        <h1 class="text-xl font-black bg-linear-to-r from-pink-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">¡Hola, {{ user.nombre }}!</h1>
        <p class="text-gray-500 text-xs font-medium">✨ Tu día es más dulce hoy.</p>
      </div>
    </div>

    <Progreso />

    <div class="grid grid-cols-2 gap-3 mb-6 mt-4">
      <div
        data-slot="card"
        class="group relative text-card-foreground flex flex-col justify-between p-3 shadow-sm border border-gray-100 rounded-xl bg-white hover:border-pink-200 hover:shadow-md transition-all cursor-pointer overflow-hidden min-h-[100px]"
      >
        <div class="absolute top-0 right-0 w-12 h-12 bg-pink-50 rounded-bl-full opacity-50 transition-transform group-hover:scale-110"></div>
        <RouterLink to="/pedidos" class="relative z-10 h-full flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <div class="p-1.5 bg-pink-50 rounded-lg text-pink-500 group-hover:bg-pink-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
            <span class="text-[10px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100">{{ clientStore.pedidos.length }}</span>
          </div>

          <div>
            <h3 class="text-xs font-bold text-gray-800 group-hover:text-pink-600 transition-colors mb-0.5">Mis Pedidos</h3>
            <p class="text-[9px] text-gray-400 font-medium">Ver historial</p>
          </div>
        </RouterLink>
      </div>

      <div
        data-slot="card"
        class="group relative text-card-foreground flex flex-col justify-between p-3 shadow-sm border border-gray-100 rounded-xl bg-white hover:border-cyan-200 hover:shadow-md transition-all cursor-pointer overflow-hidden min-h-[100px]"
      >
        <div class="absolute top-0 right-0 w-12 h-12 bg-cyan-50 rounded-bl-full opacity-50 transition-transform group-hover:scale-110"></div>

        <a class="relative z-10 h-full flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <div class="p-1.5 bg-cyan-50 rounded-lg text-cyan-500 group-hover:bg-cyan-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
            <span class="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100">{{ clientStore.pedido.canjes_disponibles ?? 0 }}</span>
          </div>

          <div>
            <h3 class="text-xs font-bold text-gray-800 group-hover:text-cyan-600 transition-colors mb-0.5">Canjeables</h3>
            <p class="text-[9px] text-gray-400 font-medium">Premios disponibles</p>
          </div>
        </a>
      </div>
    </div>

    <UltimasCompras />
  </main>
</template>
