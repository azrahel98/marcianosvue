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

    // Registrar Service Worker para soporte en Android
    //if ('serviceWorker' in navigator) {
      //navigator.serviceWorker.register('/sw.js').catch((err) => console.error('Error registrando Service Worker:', err))
    //}

    const ws = new WebSocket('wss://api.odeploy.work/ws')

    ws.onmessage = async (event) => {
      const payload = JSON.parse(event.data)
      if (payload.event === 'order_created') {
        // Usamos una función mejorada para notificar
        enviarNotificacion('Nuevo Pedido', `Orden #${payload.data?.id || ''}`)
        await pedidos_admin()
      }
    }

    // ... (resto de la lógica onclose/onerror)
    socket.value = ws
  }

  const fetchClientData = async () => {
    const user = userStore()

    try {
      const [resPuntos] = await Promise.all([api.get(`/cliente/puntos/${user.id}`), update_pedidos()])

      pedido.value = await resPuntos.data.data
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
      console.log(res.data)
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

    // En Android/Mobile es mejor disparar vía Service Worker
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      registration.showNotification(titulo, {
        body: cuerpo,
        icon: '/logo-icon.png',
        badge: '/logo-icon.png' // Icono pequeño en la barra de estado
      })
    } else {
      // Fallback para escritorio
      new Notification(titulo, { body: cuerpo, icon: '/logo-icon.png' })
    }
  }

  const solicitarPermisoHost = async () => {
    if (!('Notification' in window)) {
      console.error('Este navegador no soporta notificaciones')
      return
    }
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      console.log('Permiso concedido')
    }
  }
  return { pedido, pedidos, fetchClientData, update_pedidos, canjear, pedidos_admin, updateStatus, initSocket, solicitarPermisoHost }
})
