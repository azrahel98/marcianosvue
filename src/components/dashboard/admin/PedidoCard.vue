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
      return 'status-pendiente'
    case 'completado':
      return 'status-completado'
    case 'canje':
      return 'status-canje'
    case 'cancelado':
      return 'status-cancelado'
    case 'porcobrar':
      return 'status-porcobrar'
    case 'acuenta':
      return 'status-acuenta'
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
    console.error(error)
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow duration-200">
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[10px] font-bold text-gray-900">#{{ orden.id_pedido }}</span>
          <span class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider" :class="statusColor">
            {{ orden.estado }}
          </span>
          <span v-if="orden.es_canje" class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-50 text-pink-700"> Canje </span>
        </div>
        <p class="text-[9px] text-gray-400 mt-0.5">{{ formatDate(orden.fecha) }}</p>
        <p class="text-[11px] mt-0.5 font-semibold text-gray-800 truncate">{{ orden.usuario }}</p>
        <p class="text-[11px] mt-0.5 font-mono text-gray-800 truncate">{{ orden.requisitos }}</p>
      </div>
      <div class="text-right ml-2 shrink-0">
        <p class="text-xs font-bold text-gray-900">S/ {{ Number(orden.total_pedido).toFixed(2) }}</p>
      </div>
    </div>

    <div class="h-px bg-gray-50 my-1.5"></div>

    <div class="space-y-1">
      <div v-for="(item, index) in orden.detalle" :key="index" class="flex justify-between items-center text-[10px]">
        <div class="flex items-center gap-1.5 overflow-hidden">
          <span class="font-bold text-gray-700 min-w-[12px]">{{ item.cantidad }}x</span>
          <span class="text-gray-600 truncate">{{ item.sabor }}</span>
        </div>
        <span class="text-gray-500 font-medium ml-2 shrink-0">
          {{ Number(item.subtotal) > 0 ? `S/ ${Number(item.subtotal).toFixed(2)}` : 'Gratis' }}
        </span>
      </div>
    </div>
    <div class="mt-2 flex justify-end">
      <button @click="openModal" class="text-[10px] font-bold text-pink-600 hover:text-pink-700 hover:bg-pink-50 px-2 py-1 rounded transition-colors uppercase tracking-wide">
        Cambiar Estado
      </button>
    </div>

    <StatusModal :isOpen="isModalOpen" :currentStatus="orden.estado" :orderId="orden.id_pedido" @close="isModalOpen = false" @save="handleStatusChange" />
  </div>
</template>
