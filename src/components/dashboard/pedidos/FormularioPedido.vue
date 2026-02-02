<template>
  <form @submit.prevent="submitOrder" class="space-y-4">
    <div>
      <label class="block text-xs font-bold text-gray-600 mb-2"> Productos </label>

      <div class="flex gap-2 mb-4 items-start">
        <select
          v-model="marciano.saborid"
          @change="updateMarcianoInfo"
          class="h-9 flex-1 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 outline-none"
        >
          <option :value="0" disabled>Selecciona un sabor...</option>
          <option v-for="sabor in saboresStore.sabores?.filter((s: any) => s.stock > 0)" :key="sabor.id_sabor" :value="sabor.id_sabor" :disabled="selectedSabores.includes(sabor.id_sabor)">
            {{ sabor.nombre }} (S/ {{ sabor.precio }})
          </option>
        </select>

        <input v-model.number="marciano.cantidad" type="number" min="1" class="h-9 w-16 rounded-lg bg-gray-50 border border-gray-200 px-2 text-xs text-center outline-none" />

        <button type="button" @click="addItem" class="h-9 px-3 bg-cyan-600 text-white rounded-lg text-xs font-bold hover:bg-cyan-700 transition-colors">+</button>
      </div>

      <TransitionGroup name="list" tag="div" class="space-y-2 relative">
        <div v-for="(item, index) in pedido.items" :key="item.saborid" class="flex gap-2 items-start bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
          <div class="h-9 flex-1 flex items-center px-3 text-xs text-gray-700 bg-gray-50 rounded-md">
            {{ item.nombre }}
          </div>

          <input v-model.number="item.cantidad" type="number" min="1" class="h-9 w-16 rounded-lg bg-gray-50 border border-gray-200 px-2 text-xs text-center outline-none" />

          <button type="button" @click="removeItem(index)" class="h-9 w-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
            ✕
          </button>
        </div>
      </TransitionGroup>
    </div>

    <div class="bg-gray-50 p-3 rounded-lg flex justify-between items-center text-sm font-bold text-gray-700">
      <span>Total:</span>
      <span class="text-lg text-cyan-700">S/ {{ totalPedido.toFixed(2) }}</span>
    </div>

    <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
      <button type="button" @click="$emit('close')" class="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancelar</button>
      <button
        type="submit"
        :disabled="isSubmittingOrder || pedido.items.length === 0"
        class="px-4 py-2 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 disabled:opacity-50 transition-all transform active:scale-95"
      >
        {{ isSubmittingOrder ? 'Guardando…' : 'Registrar Pedido' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { userStore } from '@store/user'
import { useSaboresStore } from '@store/sabores'
import { api } from '@api/axios'

const emit = defineEmits(['refresh', 'close'])

const user = userStore()

const selectedSabores = computed(() => pedido.value.items.map((item) => item.saborid))
const saboresStore = useSaboresStore()

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
    // Usamos spread para romper la reactividad y que no se sigan vinculando
    pedido.value.items.push({ ...marciano.value })

    // Reset manual
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

    const solicitudes = pedido.value.items.map((item) =>
      api.post('cliente/pedido', {
        id_usuario: pedido.value.clientId,
        id_sabor: item.saborid,
        cantidad: item.cantidad
      })
    )

    await Promise.all(solicitudes)

    emit('refresh')
  } catch (error) {
    alert((error as Error).message)
    console.log(error)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
/* Transición de entrada y salida */
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

/* Para que los elementos que se quedan no salten, sino que se deslicen */
.list-move {
  transition: transform 0.4s ease;
}
</style>
