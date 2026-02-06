<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSaboresStore } from '@store/sabores'
import { useClientStore } from '@store/cliente'

const emit = defineEmits(['close', 'success'])
const props = defineProps<{ isOpen: boolean }>()

const flavorsStore = useSaboresStore()
const clientStore = useClientStore()

const selectedFlavorId = ref<number | null>(null)
const isLoading = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  await flavorsStore.fetchSabores()
})

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
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl transform transition-all relative m-4">
      <h3 class="text-lg font-black text-gray-800 mb-2">¡Canjea tu Recompensa! 🎁</h3>
      <p class="text-sm text-gray-600 mb-4">Elige tu sabor favorito para llevarte tu marciano gratis.</p>

      <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg font-medium">
        {{ errorMsg }}
      </div>

      <div class="mb-6">
        <label class="block text-xs font-bold text-gray-600 mb-2">Sabor</label>
        <select
          v-model="selectedFlavorId"
          class="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 outline-none transition-colors"
        >
          <option :value="null" disabled>Selecciona un sabor...</option>
          <option v-for="sabor in flavorsStore.sabores" :key="sabor.id_sabor" :value="sabor.id_sabor" :disabled="sabor.stock === 0">
            {{ sabor.nombre }} {{ sabor.stock === 0 ? '(Agotado)' : '' }} - S/ {{ sabor.precio }} (GRATIS)
          </option>
        </select>
      </div>

      <div class="flex gap-3 justify-end">
        <button @click="$emit('close')" class="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
        <button
          @click="handleRedeem"
          :disabled="!selectedFlavorId || isLoading"
          class="px-6 py-2 bg-linear-to-r from-pink-500 to-pink-600 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 transition-all transform active:scale-95"
        >
          {{ isLoading ? 'Canjeando...' : 'Canjear Ahora' }}
        </button>
      </div>
    </div>
  </div>
</template>
