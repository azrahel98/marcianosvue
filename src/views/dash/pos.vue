<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useSaboresStore } from '@store/sabores'
import { useAdminPedidosStore } from '@store/adminPedidos'
import { userStore } from '@store/user'
import { api } from '@api/axios'
import POSCart from '@comp/dashboard/pos/POSCart.vue'
import POSProductGrid from '@comp/dashboard/pos/POSProductGrid.vue'

const saboresStore = useSaboresStore()
const adminStore = useAdminPedidosStore()
const user = userStore()

const isSubmitting = ref(false)

// Tab state for mobile
const activeTab = ref('products')

// State for the POS cart
const selectedClientId = ref(0)
const cartItems = ref<any[]>([])

const totalCart = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
})

onMounted(async () => {
  saboresStore.fetchSabores()
  if (user.isAdmin) {
    await adminStore.obtenerListaClientes()
  }
})

const handleAddProduct = (sabor: any) => {
  if (sabor.stock === 0) return

  const existingItem = cartItems.value.find(item => item.saborid === sabor.id_sabor)
  if (existingItem) {
    existingItem.cantidad++
  } else {
    cartItems.value.push({
      saborid: sabor.id_sabor,
      nombre: sabor.nombre,
      precio: sabor.precio,
      cantidad: 1
    })
  }
}

const handleUpdateQty = (saborid: number, delta: number) => {
  const item = cartItems.value.find(i => i.saborid === saborid)
  if (item) {
    if (item.cantidad + delta <= 0) return
    item.cantidad += delta
  }
}

const handleRemoveItem = (saborid: number) => {
  cartItems.value = cartItems.value.filter(item => item.saborid !== saborid)
}

const handleSubmitOrder = async () => {
  if (cartItems.value.length === 0 || (user.isAdmin && selectedClientId.value === 0)) return

  try {
    isSubmitting.value = true

    const productos = cartItems.value.map(item => ({
      idSabor: item.saborid,
      cantidad: item.cantidad
    }))

    if (user.isAdmin) {
      await adminStore.crearPedidoParaCliente(selectedClientId.value, productos, 'pendiente')
    } else {
      await api.post('/cliente/comprar', { userId: user.id, productos })
    }

    // Reset cart on success
    cartItems.value = []
    selectedClientId.value = 0
    
    // Refresh stock if needed
    saboresStore.fetchSabores()
    
    // Switch back to products tab on success if on mobile
    activeTab.value = 'products'
    
    alert('Pedido creado exitosamente')

  } catch (error) {
    console.error(error)
    alert((error as Error).message || 'Error al crear pedido')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="h-auto min-h-[calc(100vh-1rem)] lg:h-[calc(100vh-1rem)] w-full p-2 lg:p-4 lg:pl-0 flex flex-col relative">
    <!-- Mobile Tabs Navigation -->
    <div class="flex lg:hidden bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl mb-3 p-1 shadow-sm sticky top-2 z-30">
      <button
        @click="activeTab = 'products'"
        class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
        :class="activeTab === 'products' ? 'bg-linear-to-r from-pink-500 to-pink-600 text-white shadow-md' : 'text-gray-500'"
      >
        <span>🍦</span> Productos
      </button>
      <button
        @click="activeTab = 'cart'"
        class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all relative"
        :class="activeTab === 'cart' ? 'bg-linear-to-r from-cyan-500 to-cyan-600 text-white shadow-md' : 'text-gray-500'"
      >
        <span>🛒</span> Mi Carrito
        <span v-if="cartItems.length > 0" class="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
          {{ cartItems.length }}
        </span>
      </button>
    </div>

    <!-- Outer container -->
    <div class="h-auto lg:h-full flex-1 w-full bg-background lg:rounded-3xl rounded-none p-0 lg:p-4 flex flex-col lg:flex-row gap-4 lg:gap-4 lg:overflow-hidden lg:border border-border lg:shadow-sm">
      
      <!-- Right side: Products Grid -->
      <div 
        class="h-auto lg:h-full flex-1 w-full bg-white lg:bg-transparent rounded-2xl lg:rounded-none"
        :class="activeTab === 'products' ? 'block' : 'hidden lg:block'"
      >
        <POSProductGrid
          :sabores="saboresStore.sabores"
          @addProduct="handleAddProduct"
        />
      </div>

      <!-- Left side: Cart -->
      <div 
        class="h-auto lg:h-full lg:w-[320px] shrink-0 w-full pt-0 lg:pt-0"
        :class="activeTab === 'cart' ? 'block animate-fade-in' : 'hidden lg:block'"
      >
        <POSCart
          :clients="adminStore.clientes"
          :selectedClientId="selectedClientId"
          :cartItems="cartItems"
          :isSubmitting="isSubmitting"
          @update:selectedClientId="selectedClientId = $event"
          @updateItemQty="handleUpdateQty"
          @removeItem="handleRemoveItem"
          @submitOrder="handleSubmitOrder"
        />
      </div>
    </div>

    <!-- Floating Action Button for Mobile (Quick access to Cart) -->
    <div 
      v-if="cartItems.length > 0 && activeTab === 'products'" 
      class="lg:hidden fixed bottom-24 right-4 z-40"
    >
      <button 
        @click="activeTab = 'cart'"
        class="flex items-center gap-3 bg-linear-to-r from-cyan-500 to-cyan-600 text-white pl-4 pr-5 py-3 rounded-2xl shadow-xl shadow-cyan-200 border border-white/20 active:scale-95 transition-all"
      >
        <div class="relative">
          <span class="text-xl">🛒</span>
          <span class="absolute -top-2 -right-2 bg-pink-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">{{ cartItems.length }}</span>
        </div>
        <div class="flex flex-col items-start leading-none">
          <span class="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Ver Carrito</span>
          <span class="text-sm font-black text-white">S/ {{ totalCart.toFixed(2) }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
