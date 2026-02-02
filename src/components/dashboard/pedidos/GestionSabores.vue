<script setup lang="ts">
import { ref, reactive } from 'vue'
import { userStore } from '@store/user'
import { useSaboresStore, type Sabor } from '@store/sabores'

const user = userStore()
const saboresStore = useSaboresStore()
const isCreating = ref(false)

const newSabor = reactive({
  nombre: '',
  precio: 0,
  stock_inicial: 0
})

const stockInputs = reactive<Record<number, number>>({})

saboresStore.sabores.forEach((s) => {
  if (s.id) stockInputs[s.id] = 0
})

const emit = defineEmits(['open-modal'])

const handleCreateSabor = async () => {
  if (!newSabor.nombre || newSabor.precio <= 0) return
  isCreating.value = true
  try {
    await saboresStore.createSabor({
      nombre: newSabor.nombre,
      precio: newSabor.precio,
      stock: newSabor.stock_inicial
    })
    // Reset form
    newSabor.nombre = ''
    newSabor.precio = 0
    newSabor.stock_inicial = 0
  } catch (error) {
    console.error('Error al crear sabor:', error)
  } finally {
    isCreating.value = false
  }
}

const handleUpdateStock = async (id: number) => {
  const amount = stockInputs[id]
  if (!amount || amount <= 0) return

  try {
    await saboresStore.updateStock({
      id_sabor: id,
      cantidad_nueva: amount
    })
    stockInputs[id] = 0
  } catch (error) {
    console.error('Error al actualizar stock:', error)
  }
}

const isStockInputInvalid = (sabor: Sabor) => {
  if (!sabor.id) return true
  const val = stockInputs[sabor.id]
  return !val || val <= 0
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black bg-linear-to-r from-pink-600 to-cyan-600 bg-clip-text text-transparent">Gestión de Sabores</h1>
        <p v-if="user.isAdmin" class="text-gray-600 mt-1 text-sm font-medium">Administra stock y crea nuevos sabores.</p>
      </div>
      <button
        v-if="!user.isAdmin"
        @click="$emit('open-modal')"
        class="h-10 px-5 bg-linear-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="25" y2="8" />
          <line x1="22" y1="5" x2="22" y2="11" />
        </svg>
        Registrar Pedido
      </button>
      <button
        v-else
        @click="$emit('open-modal')"
        class="h-10 px-5 bg-linear-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="25" y2="8" />
          <line x1="22" y1="5" x2="22" y2="11" />
        </svg>
        Registrar Pedido
      </button>
    </div>

    <div v-if="user.isAdmin" class="mb-8 bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-pink-100 shadow-sm">
      <h2 class="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span class="p-1 px-2 bg-pink-100 text-pink-600 rounded-md text-xs">Nuevo</span>
        Agregar Sabor
      </h2>
      <form @submit.prevent="handleCreateSabor" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">Nombre</label>
          <input
            v-model="newSabor.nombre"
            type="text"
            placeholder="Ej. Fresa"
            class="h-9 w-full rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">Precio</label>
          <input
            v-model.number="newSabor.precio"
            type="number"
            step="0.01"
            min="0"
            class="h-9 w-full rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1">Stock Inicial</label>
          <input
            v-model.number="newSabor.stock_inicial"
            type="number"
            min="0"
            class="h-9 w-full rounded-lg bg-gray-50 border border-gray-200 px-3 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
          />
        </div>
        <div>
          <button
            type="submit"
            :disabled="isCreating || !newSabor.nombre"
            class="h-9 w-full bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-lg text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {{ isCreating ? 'Creando...' : 'Crear Sabor' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Sabores Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="sabor in saboresStore.sabores"
        :key="sabor.id"
        class="group relative bg-white p-5 rounded-2xl border border-cyan-100 shadow-sm hover:shadow-lg hover:border-cyan-300 transition-all overflow-hidden"
      >
        <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-50 to-transparent rounded-bl-full opacity-50"></div>

        <div class="relative z-10">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-lg font-black text-gray-800">{{ sabor.nombre }}</h3>
              <p class="text-xs text-gray-500 font-medium">S/ {{ sabor.precio }}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Stock</p>
              <p class="text-2xl font-black text-cyan-600">{{ sabor.stock }}</p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-50">
            <label class="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
              {{ user.isAdmin ? 'Reponer Stock' : 'Hacer Pedido' }}
            </label>
            <div class="flex gap-2" v-if="sabor.id">
              <input
                v-model.number="stockInputs[sabor.id]"
                type="number"
                min="1"
                placeholder="0"
                class="h-8 flex-1 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 outline-none transition-all placeholder:text-gray-300"
              />
              <button
                @click="handleUpdateStock(sabor.id!)"
                :disabled="isStockInputInvalid(sabor)"
                class="h-8 px-4 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 font-bold rounded-lg text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ user.isAdmin ? '+' : 'Pedir' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
