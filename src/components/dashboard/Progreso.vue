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
  <div v-if="pedido && faltan !== undefined" class="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm shadow-gray-100/50 border border-gray-100/50 transition-all hover:shadow-md group">
    <div class="absolute -top-6 -right-6 w-20 h-20 bg-pink-100 rounded-full blur-3xl opacity-60 transition-transform duration-700 group-hover:scale-150 group-hover:bg-pink-200"></div>

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
      <div class="z-10 relative">
        <h2 class="font-bold text-gray-900 text-sm tracking-tight">Tu Fidelidad</h2>
        <p class="text-[11px] text-gray-400 font-medium">Colecciona 10 helados</p>
      </div>

      <button
        v-if="tieneCanjes"
        @click="showRedeemModal = true"
        class="relative flex items-center justify-center gap-1.5 bg-pink-600 text-white text-[10px] px-3.5 py-1.5 rounded-lg sm:rounded-full font-bold hover:bg-pink-700 transition-all active:scale-95 shadow-md shadow-pink-200 animate-pulse w-full sm:w-auto"
      >
        <span class="text-xs">🎁</span> CANJEAR AHORA
      </button>
    </div>

    <div class="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2 justify-items-center mb-5 relative z-10">
      <div
        v-for="i in 10"
        :key="i"
        class="relative w-9 h-9 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-500 cursor-default shadow-sm border"
        :class="[
          i <= completados ? 'bg-linear-to-br from-cyan-400 to-cyan-500 shadow-cyan-300/60 scale-[1.05] border-transparent hover:scale-110' :
          i === completados + 1 ? 'bg-white border-2 border-dashed border-cyan-400 animate-pulse hover:scale-110 shadow-cyan-100/50' :
          'bg-gray-50 border-gray-100 opacity-70'
        ]"
      >
        <span :class="i <= completados ? 'filter-none drop-shadow-sm' : i === completados + 1 ? 'grayscale-[0.2]' : 'grayscale brightness-150 opacity-40'" class="text-sm transition-all duration-300"> 🍦 </span>
        <div v-if="i <= completados" class="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-cyan-100">
          <div class="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-sm shadow-cyan-200"></div>
        </div>
      </div>
    </div>

    <div class="space-y-2 relative z-10">
      <div class="flex justify-between items-end px-1">
        <span class="text-xs font-bold tracking-tight" :class="completados === 10 ? 'text-cyan-600 animate-pulse translate-y-[-2px]' : 'text-cyan-700'">
          {{ tituloProgreso }}
        </span>
        <span class="text-[10px] text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
          <span class="text-cyan-600">{{ completados }}</span> de 10
        </span>
      </div>

      <div class="w-full bg-gray-100 h-2 sm:h-2 rounded-full overflow-hidden shadow-inner border border-gray-200/50">
        <div
          class="bg-linear-to-r from-cyan-400 via-cyan-500 to-cyan-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(6,182,212,0.4)]"
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
