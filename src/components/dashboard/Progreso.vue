<script setup lang="ts">
import { useClientStore } from '@store/cliente'
import { ref } from 'vue'
import ModalCanje from '@comp/dashboard/canje/ModalCanje.vue'

const store = useClientStore()
const showRedeemModal = ref(false)
</script>

<template>
  <div v-if="store.pedido && store.pedido.faltan_para_el_proximo !== undefined" class="relative overflow-hidden bg-white rounded-3xl p-5 shadow-lg border border-pink-50">
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-bold text-gray-800 text-sm">Tu Progreso</h2>
      <button
        v-if="store.pedido.canjes_disponibles > 0"
        @click="showRedeemModal = true"
        class="bg-pink-100 text-pink-600 text-[10px] px-2 py-1 rounded-full font-black animate-bounce hover:bg-pink-200 transition-colors cursor-pointer border border-pink-200"
      >
        {{ store.pedido.canjes_disponibles }} CANJE(S) LISTO(S) 🎁
      </button>
    </div>

    <div class="flex gap-2 justify-center mb-5 flex-wrap">
      <div
        v-for="i in Math.max(0, 10 - (store.pedido.faltan_para_el_proximo ?? 10))"
        :key="`filled-${i}`"
        class="w-9 h-9 rounded-full flex items-center justify-center bg-linear-to-br from-pink-400 to-pink-600 shadow-md transform scale-110 transition-transform"
      >
        🍦
      </div>

      <div
        v-for="i in Math.max(0, store.pedido.faltan_para_el_proximo ?? 0)"
        :key="`empty-${i}`"
        class="w-9 h-9 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 opacity-40"
      >
        <span class="grayscale filter">🍦</span>
      </div>
    </div>

    <div class="text-center">
      <p class="text-[10px] text-gray-400 mb-2 font-medium">
        {{ `Faltan ${store.pedido.faltan_para_el_proximo ?? 0} para tu regalo` }}
      </p>
      <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div class="bg-linear-to-r from-pink-400 to-pink-600 h-full transition-all duration-1000 ease-out" :style="{ width: `${(store.pedido.puntos_totales ?? 0) * 10}%` }"></div>
      </div>
    </div>
  </div>

  <div v-else class="p-5 text-center text-gray-400 text-xs">Cargando progreso...</div>

  <ModalCanje :isOpen="showRedeemModal" @close="showRedeemModal = false" @success="store.fetchClientData()" />
</template>
