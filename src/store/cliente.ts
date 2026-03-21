import { api } from '@api/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userStore } from './user'

export const useClientStore = defineStore('clientStore', () => {
  const pedido = ref<any>({})
  const pedidos = ref<any[]>([])
  const socket = ref<WebSocket | null>(null)

  const initSocket = async () => {
    if (socket.value?.readyState === WebSocket.OPEN) return

    const ws = new WebSocket('wss://api.odeploy.work/ws')

    ws.onmessage = async (event) => {
      const payload = JSON.parse(event.data)
      if (payload.event === 'order_created') {
        enviarNotificacion('Nuevo Pedido', `Orden #${payload.data?.id || ''}`)
        await pedidos_admin()
      }
    }

    socket.value = ws
  }

  const fetchClientData = async () => {
    const user = userStore()

    try {
      if (user.isAdmin) {
        await pedidos_admin()
      } else {
        const [resPuntos] = await Promise.all([api.get(`/cliente/puntos/${user.id}`), update_pedidos()])
        pedido.value = await resPuntos.data.data
      }
    } catch (error) {
      console.error('Error cargando datos del cliente:', error)
    }
  }

  const update_pedidos = async () => {
    const user = userStore()
    try {
      const res = await api.get(`/cliente/pedidos-agrupados/${user.id}`)

      pedidos.value = await res.data
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
      return await res.data
    } catch (error) {
      console.error('Error al canjear:', error)
      throw error
    }
  }

  const pedidos_admin = async () => {
    try {
      const res = await api.get('/pedidos')
      pedidos.value = await res.data
    } catch (error) {
      console.error('Error al canjear:', error)
      throw error
    }
  }

  const updateStatus = async (id_pedido: number, nuevoEstado: string) => {
    try {
      const res = await api.patch('/cliente/estado', {
        id_pedido,
        nuevoEstado
      })

      await pedidos_admin()
      return await res.data
    } catch (error) {
      console.error('Error actualizando estado:', error)
      throw error
    }
  }
  const enviarNotificacion = async (titulo: string, cuerpo: string) => {
    if (Notification.permission !== 'granted') return

    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      registration.showNotification(titulo, {
        body: cuerpo,
        icon: '/logo-icon.png',
        badge: '/logo-icon.png'
      })
    } else {
      new Notification(titulo, { body: cuerpo, icon: '/logo-icon.png' })
    }
  }

  return { pedido, pedidos, fetchClientData, update_pedidos, canjear, updateStatus, initSocket, pedidos_admin }
})
