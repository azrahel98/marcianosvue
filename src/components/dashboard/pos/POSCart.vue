<script setup lang="ts">
import { computed } from 'vue'
import { userStore } from '@store/user'

const user = userStore()

const props = defineProps<{
  clients: any[]
  selectedClientId: number
  cartItems: any[]
  isSubmitting: boolean
}>()

const emit = defineEmits(['update:selectedClientId', 'updateItemQty', 'removeItem', 'submitOrder'])

const subtotal = computed(() => {
  return props.cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
})

const total = computed(() => {
  return subtotal.value
})

const clientIdSync = computed({
  get: () => props.selectedClientId,
  set: (val) => emit('update:selectedClientId', val)
})
</script>

<template>
  <div class="h-auto lg:h-full flex flex-col bg-white lg:rounded-2xl rounded-xl shadow-sm border border-border/80 lg:overflow-hidden overflow-visible w-full shrink-0">
    <!-- Header Controls -->
    <div class="p-4 border-b border-border/60 bg-gray-50/30">
      <div class="flex gap-2">
        <!-- Client Selector -->
        <div v-if="user.isAdmin" class="relative w-full group">
          <select
            v-model="clientIdSync"
            class="h-9 w-full appearance-none bg-white border border-border/80 rounded-xl pl-3 pr-8 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-sm"
          >
            <option :value="0" disabled>Seleccionar Cliente</option>
            <option v-for="client in clients" :key="client.id_usuario" :value="client.id_usuario">
              {{ client.nombre }}
            </option>
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
        <div v-else class="text-xs font-bold text-gray-800 py-1 flex items-center gap-1.5">
          <span class="text-lg">🛍️</span> Mi Nuevo Pedido
        </div>
      </div>
    </div>

    <!-- Active Cart Items -->
    <div class="flex-1 lg:overflow-y-auto overflow-visible p-4 space-y-2.5 custom-scrollbar bg-linear-to-b from-white to-gray-50/10">
      <div v-if="cartItems.length === 0" class="h-auto lg:h-full min-h-[150px] flex flex-col items-center justify-center text-gray-300 gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        <span class="text-xs font-bold opacity-80">El carrito está vacío</span>
      </div>

      <TransitionGroup name="list" tag="div" class="space-y-2.5">
        <div v-for="item in cartItems" :key="item.saborid" class="group flex items-start justify-between bg-white border border-border/60 p-2 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-primary/30 transition-all">
          <div class="flex gap-2">
            <div class="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center shrink-0 border border-primary/10">
               <span class="text-lg drop-shadow-xs">🧊</span>
            </div>
            <div class="flex flex-col justify-center">
              <h3 class="text-xs font-bold text-gray-800 truncate max-w-[120px]">{{ item.nombre }}</h3>
              <p class="text-[10px] font-bold text-gray-400 mt-0.5">S/ {{ Number(item.precio).toFixed(2) }}</p>
              
              <!-- Quick remove action on hover -->
              <button @click="$emit('removeItem', item.saborid)" class="text-[9px] text-destructive tracking-wide font-bold mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-left">
                Eliminar
              </button>
            </div>
          </div>

          <div class="flex items-center gap-1.5 bg-gray-50/50 border border-border/50 rounded-lg p-0.5 shrink-0 mt-1">
            <button
              @click="$emit('updateItemQty', item.saborid, -1)"
              class="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-white hover:text-black hover:shadow-xs transition-all disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
            </button>
            <span class="w-4 text-center text-xs font-black text-gray-800">{{ item.cantidad }}</span>
            <button
              @click="$emit('updateItemQty', item.saborid, 1)"
              class="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-white hover:text-black hover:shadow-xs transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Summary & Checkout Footer -->
    <div class="p-4 border-t border-border/60 bg-white">
      <div class="space-y-1 mb-4 relative">
        <div class="flex justify-between items-center px-1">
          <span class="text-[11px] font-bold text-gray-400">Subtotal</span>
          <span class="text-[11px] font-black text-gray-600">S/ {{ subtotal.toFixed(2) }}</span>
        </div>
        
        <!-- Divider with circles (ticket effect) -->
        <div class="relative w-full my-2">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-dashed border-border/80"></div>
          </div>
          <div class="absolute -left-5 -top-1.5 w-3 h-3 bg-gray-50/50 rounded-full"></div>
          <div class="absolute -right-5 -top-1.5 w-3 h-3 bg-gray-50/50 rounded-full"></div>
        </div>

        <div class="flex justify-between items-end px-1 pt-1">
          <span class="text-[11px] font-bold text-gray-800">TOTAL</span>
          <span class="text-xl font-black text-primary">
            S/ {{ total.toFixed(2) }}
          </span>
        </div>
      </div>

      <button
        @click="$emit('submitOrder')"
        :disabled="cartItems.length === 0 || (user.isAdmin && selectedClientId === 0) || isSubmitting"
        class="w-full relative py-2.5 rounded-xl bg-primary outline-none hover:opacity-90 active:scale-[0.98] transition-all group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex justify-center shadow-sm"
      >
        <div class="relative flex items-center justify-center gap-1.5">
           <span v-if="isSubmitting" class="animate-spin h-3.5 w-3.5 border border-white/30 border-t-white rounded-full"></span>
           <span class="text-xs font-black tracking-wide text-primary-foreground">Confirmar Pedido</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.95);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.list-move {
  transition: transform 0.3s ease;
}
</style>
