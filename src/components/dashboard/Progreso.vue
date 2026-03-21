<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClientStore } from '@store/cliente'
import ModalCanje from '@comp/dashboard/canje/ModalCanje.vue'

const store = useClientStore()
const showRedeemModal = ref(false)

const pedido = computed(() => store.pedido)
const faltan = computed(() => pedido.value?.faltan_para_el_proximo ?? 0)
const completados = computed(() => Math.max(0, 10 - faltan.value))
const porcentajeProgreso = computed(() => (completados.value / 10) * 100)
const tieneCanjes = computed(() => (pedido.value?.canjes_disponibles ?? 0) > 0)

const tituloProgreso = computed(() => {
  if (completados.value === 10) return "🎉 ¡TIENES UNO GRATIS!"
  if (completados.value >= 8) return "¡Ya casi tienes tu gratis! 👀"
  if (completados.value >= 4) return "Ya vas a mitad 🔥"
  if (completados.value >= 1) return "Vamos empezando 💪"
  return "Inicia tu colección 🏃‍♂️"
})
</script>

<template>
  <div v-if="pedido && faltan !== undefined" class="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-7 shadow-lg shadow-gray-100/50 border border-gray-100/50 transition-all hover:shadow-xl group">
    <div class="absolute -top-6 -right-6 w-24 h-24 bg-pink-100 rounded-full blur-3xl opacity-60 transition-transform duration-700 group-hover:scale-150 group-hover:bg-pink-200"></div>

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div class="z-10 relative">
        <h2 class="font-black text-gray-900 text-lg sm:text-base tracking-tight mb-1 sm:mb-0">Tu Fidelidad</h2>
        <p class="text-xs sm:text-[11px] text-gray-500 font-medium">Colecciona 10 helados</p>
      </div>

      <button
        v-if="tieneCanjes"
        @click="showRedeemModal = true"
        class="relative flex items-center justify-center gap-2 bg-pink-600 text-white text-[11px] sm:text-[10px] px-5 sm:px-4 py-2.5 sm:py-2 rounded-xl sm:rounded-full font-black hover:bg-pink-700 transition-all active:scale-95 shadow-lg shadow-pink-200 animate-pulse w-full sm:w-auto"
      >
        <span class="text-sm sm:text-xs">🎁</span> CANJEAR AHORA
      </button>
    </div>

    <div class="grid grid-cols-5 sm:grid-cols-10 gap-4 sm:gap-3 justify-items-center mb-8 relative z-10">
      <div
        v-for="i in 10"
        :key="i"
        class="relative w-12 h-12 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-500 cursor-default shadow-sm border"
        :class="[
          i <= completados ? 'bg-linear-to-br from-cyan-400 to-cyan-500 shadow-cyan-300/60 scale-[1.05] border-transparent hover:scale-110' : 
          i === completados + 1 ? 'bg-white border-2 border-dashed border-cyan-400 animate-pulse hover:scale-110 shadow-cyan-100/50' : 
          'bg-gray-50 border-gray-100 opacity-70'
        ]"
      >
        <span :class="i <= completados ? 'filter-none drop-shadow-sm scale-110' : i === completados + 1 ? 'scale-100 grayscale-[0.2]' : 'grayscale brightness-150 opacity-40'" class="text-base sm:text-lg transition-all duration-300"> 🍦 </span>
        <div v-if="i <= completados" class="absolute -top-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-sm border border-cyan-100">
          <div class="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse shadow-sm shadow-cyan-200"></div>
        </div>
      </div>
    </div>

    <div class="space-y-3 relative z-10">
      <div class="flex justify-between items-end px-1">
        <span class="text-sm font-black tracking-tight" :class="completados === 10 ? 'text-cyan-600 animate-pulse translate-y-[-2px]' : 'text-cyan-700'">
          {{ tituloProgreso }}
        </span>
        <span class="text-[11px] text-gray-600 font-black bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 shadow-inner">
          <span class="text-cyan-600">{{ completados }}</span> de 10 completados
        </span>
      </div>

      <div class="w-full bg-gray-100 h-3.5 sm:h-3 rounded-full overflow-hidden shadow-inner border border-gray-200/50">
        <div
          class="bg-linear-to-r from-cyan-400 via-cyan-500 to-cyan-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(6,182,212,0.5)]"
          :style="{ width: `${porcentajeProgreso}%` }"
        ></div>
      </div>
    </div>
  </div>

  <div v-else class="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 animate-pulse">
    <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div class="grid grid-cols-5 gap-3 mb-6">
      <div v-for="n in 10" :key="n" class="w-9 h-9 bg-gray-100 rounded-xl"></div>
    </div>
    <div class="h-2 bg-gray-100 rounded-full"></div>
  </div>

  <ModalCanje :isOpen="showRedeemModal" @close="showRedeemModal = false" @success="store.fetchClientData()" />
</template>
