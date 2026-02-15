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
    <div class="bg-white rounded-lg shadow-xl w-full max-w-xs overflow-hidden transform transition-all">
      <div class="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <h3 class="text-sm font-bold text-gray-900">Movimiento de Stock</h3>
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

      <div class="p-4 space-y-3">
        <div class="bg-gray-50 p-2.5 rounded border border-gray-100">
          <p class="text-[10px] text-gray-500 uppercase tracking-wide font-bold mb-0.5">Producto</p>
          <div class="flex justify-between items-center">
            <p class="text-sm font-bold text-gray-900 truncate mr-2">{{ sabor?.nombre }}</p>
            <p class="text-xs text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
              Stock: <span class="font-bold">{{ sabor?.stock }}</span>
            </p>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block text-[10px] font-bold text-gray-700 uppercase tracking-wide">Tipo de Movimiento</label>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="t in tipos"
              :key="t.value"
              @click="tipo = t.value"
              class="px-2 py-1.5 text-[10px] font-bold rounded border transition-colors text-center"
              :class="tipo === t.value ? 'bg-pink-50 border-pink-500 text-pink-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'"
            >
              {{ t.label }}
            </button>
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="cantidad" class="block text-[10px] font-bold text-gray-700 uppercase tracking-wide">Cantidad</label>
          <input
            id="cantidad"
            type="number"
            min="1"
            v-model="cantidad"
            class="block w-full rounded border-gray-300 bg-white p-2 text-sm focus:border-pink-500 focus:ring-pink-500 shadow-sm outline-none transition-shadow"
          />
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
          {{ loading ? 'Guardando...' : 'Registrar' }}
        </button>
      </div>
    </div>
  </div>
</template>
