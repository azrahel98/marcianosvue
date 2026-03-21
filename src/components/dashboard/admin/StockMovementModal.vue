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
        <div v-if="isOpen" class="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl shadow-black/10 border border-white/60 relative z-10 transition-all">
          <div class="px-5 py-4 border-b border-gray-100/60 flex justify-between items-center bg-white/50">
            <h3 class="text-sm font-black text-gray-900 flex items-center gap-2"><span class="text-lg">📦</span> Movimiento de Stock</h3>
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

          <div class="p-6 space-y-5">
            <div class="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
              <p class="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Producto a ajustar</p>
              <div class="flex justify-between items-center mt-2">
                <p class="text-sm font-bold text-gray-900 truncate mr-2">{{ sabor?.nombre }}</p>
                <p class="text-[10px] text-gray-600 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm font-bold">
                  Stock actual: <span class="text-emerald-600 font-black ml-1 text-sm">{{ sabor?.stock }}</span>
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-700 uppercase tracking-widest pl-1">Tipo de Movimiento</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="t in tipos"
                  :key="t.value"
                  @click="tipo = t.value"
                  class="px-3 py-2 text-xs font-bold rounded-xl border shadow-sm transition-all text-center flex items-center justify-center transform active:scale-95"
                  :class="tipo === t.value ? 'bg-pink-50 border-pink-400 text-pink-700 ring-2 ring-pink-100 ring-offset-1' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'"
                >
                  {{ t.label }}
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <label for="cantidad" class="block text-[10px] font-black text-gray-700 uppercase tracking-widest pl-1">Cantidad Ingresada</label>
              <input
                id="cantidad"
                type="number"
                min="1"
                v-model="cantidad"
                class="block w-full rounded-2xl border-gray-200 bg-gray-50/80 p-3.5 text-sm font-bold focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none"
              />
            </div>
          </div>

          <div class="px-5 py-4 bg-gray-50/50 flex justify-end gap-3 border-t border-gray-100/60">
            <button
              @click="emit('close')"
              class="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              @click="handleSave"
              :disabled="loading"
              class="px-5 py-2 text-xs font-black text-white bg-linear-to-r from-pink-500 to-pink-600 rounded-xl shadow-md shadow-pink-500/20 hover:shadow-pink-500/40 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
            >
              <svg v-if="loading" class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? '...' : '✅ Registrar' }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
