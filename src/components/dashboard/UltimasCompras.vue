<template>
  <div data-slot="card" class="text-card-foreground flex flex-col gap-4 p-5 shadow-sm border border-gray-200 rounded-2xl bg-white">
    <h3 class="text-lg font-black text-gray-800 mb-2">Últimas Compras</h3>
    <div class="space-y-3">
      <div
        class="flex justify-between items-center p-3 bg-linear-to-r from-pink-50 to-white rounded-xl border border-pink-100 hover:shadow-md transition-all"
        v-for="pedido in store.pedidos"
        :key="pedido.id"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-lg">🍋</div>
          <div>
            <p class="font-bold text-gray-900 text-sm">{{ pedido.marciano }}</p>
            <p class="text-[10px] text-gray-500 font-medium">{{ pedido.fecha }}</p>
          </div>
        </div>
        <span class="text-xs font-black text-pink-600 bg-white border border-pink-100 px-2 py-1 rounded-md shadow-sm">×{{ pedido.cantidad }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClientStore } from '@store/cliente'

const store = useClientStore()
</script>
