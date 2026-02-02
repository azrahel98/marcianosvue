<template>
  <form @submit.prevent="submitOrder" class="space-y-4">
    <div>
      <label class="block text-xs font-bold text-gray-600 mb-2"> Productos </label>

      <div class="flex gap-2 mb-2 items-start">
        <select v-model="marciano.saborid" class="h-9 flex-1 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 outline-none">
          <option
            v-for="sabor in saboresStore.sabores"
            :key="sabor.id_sabor"
            :value="sabor.id_sabor"
            :disabled="selectedSabores.includes(sabor.id_sabor)"
            @click="
              () => {
                marciano.nombre = sabor.nombre
                marciano.precio = sabor.precio
              }
            "
          >
            {{ sabor.nombre }}
          </option>
        </select>

        <input
          v-model="marciano.cantidad"
          type="number"
          min="1"
          required
          class="h-9 w-16 rounded-lg bg-gray-50 border border-gray-200 px-2 text-xs text-center focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 outline-none"
        />
      </div>
      <button type="button" @click="addItem(marciano)" class="mt-2 text-xs font-bold text-cyan-600 hover:text-cyan-700">+ Agregar producto</button>

      <div v-for="(item, index) in pedido.items as Array<any>" :key="item.id_sabor" class="flex gap-2 mb-2 items-start">
        <select v-model="item.saborid" class="h-9 flex-1 rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 outline-none">
          <option :selected="item.saborid" :value="item.saborid">{{ item.nombre }}</option>
        </select>
        <input
          v-model.number="item.cantidad"
          type="number"
          min="1"
          required
          class="h-9 w-16 rounded-lg bg-gray-50 border border-gray-200 px-2 text-xs text-center focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 outline-none"
        />

        <button type="button" @click="removeItem(index)" class="h-9 w-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">✕</button>
      </div>
    </div>

    <div class="bg-gray-50 p-3 rounded-lg flex justify-between items-center text-sm font-bold text-gray-700">
      <span>Total:</span>
      <span class="text-lg">S/ {{ totalPedido }}</span>
    </div>

    <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
      <button type="button" @click="$emit('close')" class="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancelar</button>

      <button type="submit" :disabled="isSubmittingOrder" class="px-4 py-2 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 disabled:opacity-50">
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
import { useClientStore } from '@store/cliente'

const emit = defineEmits(['close', 'refresh'])

const user = userStore()

const selectedSabores = computed(() => pedido.value.items.map((item) => item.saborid))
const saboresStore = useSaboresStore()
const cliente = useClientStore()

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

const addItem = (x: any) => {
  if (x.saborid != 0) {
    pedido.value.items.push(x)
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

const submitOrder = async () => {
  try {
    pedido.value.items.forEach(async (item) => {
      const _res = (
        await api.post('cliente/pedido', {
          id_usuario: pedido.value.clientId,
          id_sabor: item.saborid,
          cantidad: item.cantidad
        })
      ).data
      console.log(_res)
    })
    await saboresStore.fetchSabores()
    await cliente.update_pedidos()
    emit('close')
  } catch (error) {
    console.log(error)
  }
}
</script>
