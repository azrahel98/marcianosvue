<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSaboresStore } from '@store/sabores'

const props = defineProps<{
  isOpen: boolean
  sabor: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save'): void
}>()

const store = useSaboresStore()
const cantidad = ref(1)
const tipo = ref('ingreso')
const loading = ref(false)

// Reset form when modal opens
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      cantidad.value = 1
      tipo.value = 'ingreso'
    }
  }
)

const tipos = [
  { value: 'ingreso', label: 'Ingreso (+)' },
  { value: 'ajuste', label: 'Ajuste (=)' },
  { value: 'venta', label: 'Venta (-)' },
  { value: 'canje', label: 'Canje (-)' }
]

const handleSave = async () => {
  if (!props.sabor) return

  loading.value = true
  try {
    await store.registrarMovimiento(parseInt(props.sabor.id_sabor), parseInt(cantidad.value.toString()), tipo.value)
    emit('save')
    emit('close')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="emit('close')">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all">
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-900">Movimiento de Stock</h3>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <p class="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">Producto</p>
          <p class="text-lg font-bold text-gray-900">{{ sabor?.nombre }}</p>
          <p class="text-sm text-gray-600">
            Stock actual: <span class="font-bold">{{ sabor?.stock }}</span>
          </p>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-medium text-gray-700">Tipo de Movimiento</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="t in tipos"
              :key="t.value"
              @click="tipo = t.value"
              class="px-3 py-2 text-xs font-medium rounded-lg border transition-colors text-center"
              :class="tipo === t.value ? 'bg-pink-50 border-pink-500 text-pink-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'"
            >
              {{ t.label }}
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <label for="cantidad" class="block text-xs font-medium text-gray-700">Cantidad</label>
          <input
            id="cantidad"
            type="number"
            min="1"
            v-model="cantidad"
            class="block w-full rounded-lg border-gray-300 bg-white p-2.5 text-sm focus:border-pink-500 focus:ring-pink-500 shadow-sm"
          />
        </div>
      </div>

      <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="handleSave"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Guardando...' : 'Registrar' }}
        </button>
      </div>
    </div>
  </div>
</template>
