<script setup lang="ts">
import { ref, computed } from 'vue'
import StatusModal from './StatusModal.vue'
import { useClientStore } from '@store/cliente'

const props = defineProps<{
  orden: any
}>()

const store = useClientStore()
const isModalOpen = ref(false)

const statusColor = computed(() => {
  switch (props.orden.estado) {
    case 'pendiente':
      return 'bg-amber-100 text-amber-700'
    case 'completado':
      return 'bg-emerald-100 text-emerald-700'
    case 'canje':
      return 'bg-purple-100 text-purple-700'
    case 'cancelado':
      return 'bg-red-100 text-red-700'
    case 'porcobrar':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const openModal = () => {
  isModalOpen.value = true
}

const handleStatusChange = async (newStatus: string) => {
  try {
    await store.updateStatus(props.orden.id_pedido, newStatus)
    isModalOpen.value = false
  } catch (error) {
    // Handle error (maybe show a toast)
    console.error(error)
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-xs border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
    <!-- Header -->
    <div class="flex justify-between items-start mb-3">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-gray-900">#{{ orden.id_pedido }}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide" :class="statusColor">
            {{ orden.estado }}
          </span>
          <span v-if="orden.es_canje" class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-pink-100 text-pink-700"> Canje </span>
        </div>
        <p class="text-[10px] text-gray-400 mt-1">{{ formatDate(orden.fecha) }}</p>
        <p class="text-xs mt-1 font-medium">{{ orden.usuario }}</p>
      </div>
      <div class="text-right">
        <p class="text-sm font-bold text-gray-900">S/ {{ Number(orden.total_pedido).toFixed(2) }}</p>
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px bg-gray-50 my-2"></div>

    <!-- Detalles -->
    <div class="space-y-1.5">
      <div v-for="(item, index) in orden.detalle" :key="index" class="flex justify-between items-center text-xs">
        <div class="flex items-center gap-2">
          <span class="font-medium text-gray-700">{{ item.cantidad }}x</span>
          <span class="text-gray-600">{{ item.sabor }}</span>
        </div>
        <span class="text-gray-500 font-medium">
          {{ Number(item.subtotal) > 0 ? `S/ ${Number(item.subtotal).toFixed(2)}` : 'Gratis' }}
        </span>
      </div>
    </div>
    <!-- Footer Actions -->
    <div class="mt-3 flex justify-end" v-if="orden.estado !== 'canje'">
      <button @click="openModal" class="text-xs font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 px-2 py-1 rounded transition-colors">Cambiar Estado</button>
    </div>

    <StatusModal :isOpen="isModalOpen" :currentStatus="orden.estado" :orderId="orden.id_pedido" @close="isModalOpen = false" @save="handleStatusChange" />
  </div>
</template>
