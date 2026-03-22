<script setup lang="ts">
import { ref } from 'vue'
import { useSaboresStore } from '@store/sabores'
import { useClientStore } from '@store/cliente'

const emit = defineEmits(['close', 'success'])
const props = defineProps<{ isOpen: boolean }>()

const flavorsStore = useSaboresStore()
const clientStore = useClientStore()

const selectedFlavorId = ref<number | null>(null)
const isLoading = ref(false)
const errorMsg = ref('')

const handleRedeem = async () => {
  if (!selectedFlavorId.value) return

  isLoading.value = true
  errorMsg.value = ''

  try {
    await clientStore.canjear(selectedFlavorId.value)
    emit('success')
    emit('close')
  } catch (error: any) {
    errorMsg.value = error.message || 'Error al realizar el canje'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-100 flex items-center justify-center" @click.self="$emit('close')">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-md transition-all"></div>

      <!-- Modal -->
      <Transition
        enter-active-class="transition ease-out duration-300 transform"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition ease-in duration-200 transform"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div v-if="isOpen" class="bg-white/95 backdrop-blur-xl rounded-4xl w-full max-w-md p-6 sm:p-8 shadow-2xl shadow-black/10 transition-all relative z-10 mx-4 border border-white/60">
          <h3 class="text-xl font-black text-gray-900 mb-2 flex items-center gap-2 text-center w-full justify-center">
            <span class="text-2xl drop-shadow-sm filter-none">🎁</span>
            <span class="bg-linear-to-r from-pink-600 to-amber-500 bg-clip-text text-transparent">¡Canjea tu Recompensa!</span>
          </h3>
          <p class="text-sm text-gray-500 mb-6 font-medium text-center">Elige tu sabor favorito para llevarte tu marciano gratis.</p>

      <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg font-medium">
        {{ errorMsg }}
      </div>

      <div class="mb-8">
        <label class="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3">Sabor a elegir</label>
        <select
          v-model="selectedFlavorId"
          class="w-full h-12 rounded-2xl border border-gray-200 bg-gray-100/80 px-4 text-sm font-bold text-gray-800 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all cursor-pointer hover:bg-gray-200 shadow-inner"
        >
          <option :value="null" disabled>Selecciona un sabor...</option>
          <option v-for="sabor in flavorsStore.sabores" :key="sabor.id_sabor" :value="sabor.id_sabor" :disabled="sabor.stock === 0">
            {{ sabor.nombre }} {{ sabor.stock === 0 ? '(Agotado)' : '' }} - S/ {{ sabor.precio }} (GRATIS)
          </option>
        </select>
      </div>

      <div class="flex gap-3 justify-end pt-2 border-t border-gray-100/50 mt-4">
        <button @click="$emit('close')" class="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">Cancelar</button>
        <button
          @click="handleRedeem"
          :disabled="!selectedFlavorId || isLoading"
          class="px-6 py-2.5 bg-linear-to-r from-pink-500 to-pink-600 text-white text-xs font-black rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 disabled:opacity-50 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:hover:translate-y-0"
        >
          {{ isLoading ? 'Obteniendo premio...' : '✨ ¡Quiero mi Gratis!' }}
        </button>
      </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
