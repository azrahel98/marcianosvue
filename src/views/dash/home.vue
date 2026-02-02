<script setup lang="ts">
import Progreso from '@comp/dashboard/Progreso.vue'
import UltimasCompras from '@comp/dashboard/UltimasCompras.vue'
import { onMounted } from 'vue'
import { useClientStore } from '@store/cliente'
import { userStore } from '@store/user'

const clientStore = useClientStore()
const user = userStore()
onMounted(async () => {
  await clientStore.update_pedidos()
})
</script>

<template>
  <main class="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="mb-6">
      <h1 class="text-3xl font-black bg-gradient-to-r from-pink-600 to-cyan-600 bg-clip-text text-transparent">¡Hola, {{ user.nombre }}!</h1>
      <p class="text-gray-600 mt-1 text-sm font-medium">✨ Tu día es más dulce hoy.</p>
    </div>

    <Progreso />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mt-8">
      <div
        data-slot="card"
        class="group relative text-card-foreground flex flex-col gap-3 p-5 shadow-sm border border-pink-100 rounded-2xl bg-white hover:border-pink-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
      >
        <div class="absolute top-0 right-0 w-20 h-20 bg-pink-50 rounded-bl-full opacity-50 transition-transform group-hover:scale-110"></div>
        <a href="/dashboard/cliente/orders" class="block relative z-10">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base font-black text-gray-800 group-hover:text-pink-600 transition-colors">Mis Pedidos</h3>
            <div class="p-2 bg-pink-50 rounded-lg group-hover:bg-pink-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-shopping-bag w-5 h-5 text-pink-500"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 font-medium">Gestiona tus antojos recientes</p>
        </a>
      </div>

      <div
        data-slot="card"
        class="group relative text-card-foreground flex flex-col gap-3 p-5 shadow-sm border border-cyan-100 rounded-2xl bg-white hover:border-cyan-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
      >
        <div class="absolute top-0 right-0 w-20 h-20 bg-cyan-50 rounded-bl-full opacity-50 transition-transform group-hover:scale-110"></div>
        <a href="/dashboard/cliente/rewards" class="block relative z-10">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base font-black text-gray-800 group-hover:text-cyan-600 transition-colors">Canjeables</h3>
            <div class="p-2 bg-cyan-50 rounded-lg group-hover:bg-cyan-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-gift w-5 h-5 text-cyan-500"
              >
                <rect x="3" y="8" width="18" height="4" rx="1"></rect>
                <path d="M12 8v13"></path>
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
                <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 font-medium">¡Mira tus premios disponibles!</p>
        </a>
      </div>
    </div>

    <UltimasCompras />
  </main>
</template>
