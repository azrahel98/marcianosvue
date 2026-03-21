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
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="emit('close')">
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-md transition-all pointer-events-none"></div>

      <Transition
        enter-active-class="transition ease-out duration-300 transform"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition ease-in duration-200 transform"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div v-if="isOpen" class="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl shadow-black/10 border border-white/60 relative z-10 transition-all">
          <div class="px-5 py-4 border-b border-gray-100/60 flex justify-between items-center bg-white/50">
            <h3 class="text-sm font-black text-gray-900 flex items-center gap-2"><span class="text-lg">✏️</span> Cambiar Estado</h3>
            <button @click="emit('close')" class="text-gray-400 hover:text-pink-600 hover:bg-pink-50 p-1.5 rounded-xl transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

          <div class="p-5">
            <p class="text-[11px] text-gray-500 mb-4 font-medium">
              Selecciona el nuevo estado para el pedido <span class="font-black text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded-md">#{{ orderId }}</span>
            </p>

            <div class="space-y-2">
              <label for="status" class="block text-[10px] font-black text-gray-700 uppercase tracking-widest pl-1">Selección</label>
              <select
                id="status"
                v-model="selectedStatus"
                class="block w-full rounded-2xl border-gray-200 bg-gray-50/80 p-3 text-xs font-bold text-gray-800 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 cursor-pointer hover:bg-gray-100 transition-all outline-none"
              >
                <option v-for="status in statuses" :key="status.value" :value="status.value" class="font-medium">
              {{ status.label }}
            </option>
          </select>
        </div>
      </div>

          <div class="px-5 py-4 bg-gray-50/50 flex justify-end gap-2 border-t border-gray-100/60">
            <button
              @click="emit('close')"
              class="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              @click="handleSave"
              :disabled="loading"
              class="px-5 py-2 text-xs font-black text-white bg-linear-to-r from-cyan-500 to-cyan-600 rounded-xl shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5"
            >
              <svg v-if="loading" class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? '...' : '✅ Confirmar' }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
