<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  currentStatus: string
  orderId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', newStatus: string): void
}>()

const selectedStatus = ref(props.currentStatus)
const loading = ref(false)

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      selectedStatus.value = props.currentStatus
    }
  }
)

const statuses = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'completado', label: 'Completado' },
  { value: 'cancelado', label: 'Cancelado' },
  { value: 'porcobrar', label: 'Por Cobrar' },
  { value: 'canje', label: 'Canje' },
  { value: 'acuenta', label: 'a Cuenta' }
]

const handleSave = async () => {
  loading.value = true
  emit('save', selectedStatus.value)
  loading.value = false
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="emit('close')">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-xs overflow-hidden transform transition-all">
      <div class="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <h3 class="text-sm font-bold text-gray-900">Cambiar Estado</h3>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div class="p-4">
        <p class="text-xs text-gray-500 mb-3">
          Selecciona el nuevo estado para el pedido <span class="font-bold text-gray-900">#{{ orderId }}</span>
        </p>

        <div class="space-y-1.5">
          <label for="status" class="block text-[10px] font-bold text-gray-700 uppercase tracking-wide">Nuevo Estado</label>
          <select
            id="status"
            v-model="selectedStatus"
            class="block w-full rounded border-gray-300 bg-gray-50 p-2 text-xs focus:border-pink-500 focus:ring-pink-500 outline-none transition-shadow"
          >
            <option v-for="status in statuses" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="px-4 py-3 bg-gray-50 flex justify-end gap-2">
        <button
          @click="emit('close')"
          class="px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-pink-500 transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="handleSave"
          :disabled="loading"
          class="px-3 py-1.5 text-xs font-bold text-white bg-pink-600 rounded hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <svg v-if="loading" class="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>
