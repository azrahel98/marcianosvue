<script setup lang="ts">
import { ref, reactive } from 'vue'
import { userStore } from '@store/user'
import { useSaboresStore } from '@store/sabores'

const user = userStore()
const saboresStore = useSaboresStore()
const isCreating = ref(false)

const newSabor = reactive({
  nombre: '',
  precio: 0,
  stock_inicial: 0
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

    newSabor.nombre = ''
    newSabor.precio = 0
    newSabor.stock_inicial = 0
  } catch (error) {
    console.error('Error al crear sabor:', error)
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <div>
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
        v-for="sabor in saboresStore.sabores?.filter((s) => s.stock > 0)"
        :key="sabor.id"
        class="group relative bg-white p-5 rounded-2xl border border-cyan-100 shadow-sm hover:shadow-lg hover:border-cyan-300 transition-all overflow-hidden"
      >
        <div class="absolute top-0 right-0 w-16 h-16 bg--to-bl from-cyan-50 to-transparent rounded-bl-full opacity-50"></div>

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
        </div>
      </div>
    </div>
  </div>
</template>
