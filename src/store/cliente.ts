import { api } from '@api/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userStore } from './user'

export const useClientStore = defineStore('clientStore', () => {
  const pedido = ref<any>({})
  const pedidos = ref<any[]>([])

  const fetchClientData = async () => {
    const user = userStore()

    try {
      const [resPuntos] = await Promise.all([api.get(`/cliente/puntos/${user.id}`), update_pedidos()])

      pedido.value = resPuntos.data.data
    } catch (error) {
      console.error('Error cargando datos del cliente:', error)
    }
  }

  const update_pedidos = async () => {
    const user = userStore()
    try {
      const res = await api.get(`/cliente/pedidos-agrupados/${user.id}`)

      pedidos.value = res.data
    } catch (error) {
      console.error('Error cargando datos del cliente:', error)
    }
  }

  const canjear = async (idSabor: number) => {
    const user = userStore()
    try {
      const res = await api.post('/cliente/canjear', {
        userId: user.id,
        idSabor: idSabor
      })

      await fetchClientData()
      return res.data
    } catch (error) {
      console.error('Error al canjear:', error)
      throw error
    }
  }

  return { pedido, pedidos, fetchClientData, update_pedidos, canjear }
})
