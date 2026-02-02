import { api } from '@api/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { userStore } from './user'

export const useClientStore = defineStore('clientStore', () => {
  const pedidos = ref<any[]>([])

  const update_pedidos = async () => {
    const user = userStore()
    const { data } = await api.get(`/cliente?id=${user.id}`)
    pedidos.value = data
  }

  const total_acumulado = computed(() => {
    return pedidos.value.filter((p) => p.estado === 'completado' && p.cantidad > (p.cantidad_usada || 0)).reduce((acc, p) => acc + (p.cantidad - (p.cantidad_usada || 0)), 0)
  })

  return { pedidos, update_pedidos, total_acumulado }
})
