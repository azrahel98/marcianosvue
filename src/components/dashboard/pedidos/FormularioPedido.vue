<template>
  <form @submit.prevent="submitOrder" class="space-y-4">
    <div class="bg-gray-50/80 p-3 rounded-xl border border-gray-100 shadow-sm">
      <label class="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Agregar Producto
      </label>

      <div class="flex gap-2 items-stretch">
        <div class="relative flex-1 group">
          <select
            v-model="marciano.saborid"
            @change="updateMarcianoInfo"
            class="h-10 w-full rounded-lg bg-white border border-gray-200 pl-3 pr-8 text-xs font-medium text-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all appearance-none cursor-pointer hover:border-cyan-300"
          >
            <option :value="0" disabled selected>Selecciona un sabor...</option>
            <option v-for="sabor in saboresStore.sabores" :key="sabor.id_sabor" :value="sabor.id_sabor" :disabled="sabor.stock === 0 || selectedSabores.includes(sabor.id_sabor)">
              {{ sabor.nombre }} (S/ {{ sabor.precio }}) {{ sabor.stock === 0 ? '- Agotado' : '' }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400 group-hover:text-cyan-500 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        <div class="relative w-16">
          <input
            v-model.number="marciano.cantidad"
            type="number"
            min="1"
            class="h-10 w-full rounded-lg bg-white border border-gray-200 px-2 text-xs font-bold text-center text-gray-700 outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 hover:border-cyan-300"
          />
        </div>

        <button
          type="button"
          @click="addItem"
          class="h-10 w-10 flex items-center justify-center bg-linear-to-br from-cyan-500 to-cyan-600 text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>
    </div>

    <div class="space-y-2 relative min-h-[120px]">
      <div v-if="pedido.items.length === 0" class="flex flex-col items-center justify-center py-8 text-gray-300 border-2 border-dashed border-gray-100 rounded-xl h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mb-2 opacity-50"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <span class="text-xs font-medium">Tu pedido está vacío</span>
      </div>

      <TransitionGroup name="list" tag="div" class="space-y-2">
        <div
          v-for="(item, index) in pedido.items"
          :key="item.saborid"
          class="group flex gap-3 items-center bg-white p-2 pr-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-cyan-100 transition-all"
        >
          <div class="h-10 w-10 rounded-lg bg-linear-to-br from-pink-50 to-pink-100 flex items-center justify-center text-pink-400 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-bold text-gray-800 truncate">{{ item.nombre }}</h4>
            <div class="text-[10px] text-gray-400 font-medium">S/ {{ (item.precio * item.cantidad).toFixed(2) }}</div>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex flex-col items-center">
              <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Cant.</span>
              <span class="text-sm font-black text-gray-700">{{ item.cantidad }}</span>
            </div>

            <div class="w-px h-6 bg-gray-100 mx-1"></div>

            <button type="button" @click="removeItem(index)" class="h-8 w-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <div class="pt-4 mt-2 border-t border-gray-50">
      <div class="flex justify-between items-end mb-4 px-1">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total a Pagar</span>
        <div class="flex items-baseline gap-1">
          <span class="text-sm font-medium text-gray-400">S/</span>
          <span class="text-3xl font-black bg-linear-to-r from-cyan-600 to-cyan-500 bg-clip-text text-transparent">{{ totalPedido.toFixed(2) }}</span>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 py-3 text-xs font-bold text-gray-500 hover:text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="isSubmittingOrder || pedido.items.length === 0"
          class="flex-2 py-3 text-sm font-black text-white rounded-xl bg-linear-to-r from-pink-500 to-pink-600 shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <span v-if="isSubmittingOrder" class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
          {{ isSubmittingOrder ? 'Procesando...' : 'Confirmar Pedido' }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { userStore } from '@store/user'
import { useSaboresStore } from '@store/sabores'
import { api } from '@api/axios'

const emit = defineEmits(['refresh', 'close'])

const user = userStore()

const saboresStore = useSaboresStore()
onMounted(() => {
  saboresStore.fetchSabores()
})

const selectedSabores = computed(() => pedido.value.items.map((item) => item.saborid))

const marciano = ref({
  saborid: 0,
  nombre: '',
  cantidad: 1,
  precio: 0
})

const pedido = ref({
  clientId: user.id,
  items: [] as Array<any>
})

const totalPedido = computed(() => {
  return pedido.value.items.reduce((total, item) => {
    return total + item.cantidad * item.precio
  }, 0)
})

const isSubmittingOrder = ref(false)

const updateMarcianoInfo = () => {
  const selected = saboresStore.sabores?.find((s: any) => s.id_sabor === marciano.value.saborid)
  if (selected) {
    marciano.value.nombre = selected.nombre
    marciano.value.precio = selected.precio
  }
}

const addItem = () => {
  if (marciano.value.saborid !== 0) {
    const selected = saboresStore.sabores?.find((s: any) => s.id_sabor === marciano.value.saborid)
    if (selected && selected.stock <= 0) {
      alert('Producto agotado')
      return
    }

    pedido.value.items.push({ ...marciano.value })

    marciano.value = {
      saborid: 0,
      nombre: '',
      cantidad: 1,
      precio: 0
    }
  }
}

const removeItem = (index: number) => {
  pedido.value.items.splice(index, 1)
}

const loading = ref(false)

const submitOrder = async () => {
  if (pedido.value.items.length === 0) return

  try {
    loading.value = true
    isSubmittingOrder.value = true

    const payload = {
      userId: user.id,
      productos: pedido.value.items.map((item) => ({
        idSabor: item.saborid,
        cantidad: item.cantidad
      }))
    }

    await api.post('/cliente/comprar', payload)

    emit('refresh')
    emit('close')
  } catch (error) {
    alert((error as Error).message || 'Error al procesar el pedido')
    console.error(error)
  } finally {
    loading.value = false
    isSubmittingOrder.value = false
  }
}
</script>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.list-move {
  transition: transform 0.4s ease;
}
</style>
