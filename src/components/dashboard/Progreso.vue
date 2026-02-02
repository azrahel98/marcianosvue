<script setup lang="ts">
import { computed } from 'vue'
import { useClientStore } from '@store/cliente'

const store = useClientStore()

// Sincronizado con el nombre real del store
const disponibles = computed(() => store.total_acumulado)

// Cuántos círculos de helado rellenar (0 a 9)
const progresoActual = computed(() => disponibles.value % 10)

// Cuántos helados grises mostrar (si el progreso es 0 y no hay canjes, muestra 10 vacíos)
const faltantes = computed(() => 10 - progresoActual.value)

// Cuántos premios puede reclamar
const canjesDisponibles = computed(() => Math.floor(disponibles.value / 10))
</script>

<template>
  <div class="relative overflow-hidden bg-white rounded-3xl p-5 shadow-lg border border-pink-50">
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-bold text-gray-800 text-sm">Tu Progreso</h2>
      <span v-if="canjesDisponibles > 0" class="bg-pink-100 text-pink-600 text-[10px] px-2 py-1 rounded-full font-black animate-bounce">
        {{ canjesDisponibles }} CANJE(S) LISTO(S) 🎁
      </span>
    </div>

    <div class="flex gap-2 justify-center mb-5 flex-wrap">
      <div
        v-for="i in progresoActual"
        :key="`filled-${i}`"
        class="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-pink-600 shadow-md transform scale-110 transition-transform"
      >
        🍦
      </div>
      <div v-for="i in faltantes" :key="`empty-${i}`" class="w-9 h-9 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 opacity-40">
        <span class="grayscale filter">🍦</span>
      </div>
    </div>

    <div class="text-center">
      <p class="text-[10px] text-gray-400 mb-2 font-medium">
        {{ progresoActual === 0 && canjesDisponibles > 0 ? '¡Nivel completado!' : `Faltan ${faltantes} para tu regalo` }}
      </p>
      <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div class="bg-gradient-to-r from-pink-400 to-pink-600 h-full transition-all duration-1000 ease-out" :style="{ width: `${progresoActual * 10}%` }"></div>
      </div>
    </div>
  </div>
</template>
