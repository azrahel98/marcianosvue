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
</script>

<template>
  <div v-if="pedido && faltan !== undefined" class="relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm border border-gray-50 transition-all hover:shadow-md">
    <div class="absolute -top-6 -right-6 w-16 h-16 bg-pink-50 rounded-full blur-3xl"></div>

    <div class="flex justify-between items-center mb-5">
      <div>
        <h2 class="font-bold text-gray-900 text-sm tracking-tight">Tu Fidelidad</h2>
        <p class="text-[10px] text-gray-400 font-medium">Colecciona 10 helados</p>
      </div>

      <button
        v-if="tieneCanjes"
        @click="showRedeemModal = true"
        class="relative flex items-center gap-1.5 bg-pink-600 text-white text-[10px] px-3 py-1.5 rounded-full font-bold hover:bg-pink-700 transition-all active:scale-95 shadow-lg shadow-pink-200 animate-pulse"
      >
        <span>🎁</span> CANJEAR AHORA
      </button>
    </div>

    <div class="grid grid-cols-5 gap-3 justify-items-center mb-6">
      <div
        v-for="i in 10"
        :key="i"
        class="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500"
        :class="[i <= completados ? 'bg-gradient-to-br from-pink-400 to-pink-500 shadow-sm scale-110' : 'bg-gray-50 border border-dashed border-gray-200 opacity-60']"
      >
        <span :class="i <= completados ? 'filter-none' : 'grayscale brightness-150 opacity-40'" class="text-sm"> 🍦 </span>
        <div v-if="i <= completados" class="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
          <div class="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex justify-between items-end">
        <span class="text-[10px] font-bold text-pink-600 italic">
          {{ faltan === 0 ? '¡Listo para tu regalo!' : `Faltan ${faltan} pasos` }}
        </span>
        <span class="text-[10px] text-gray-400 font-semibold">{{ completados }}/10</span>
      </div>

      <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div
          class="bg-gradient-to-r from-pink-400 to-pink-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(219,39,119,0.3)]"
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
