import { api } from '@api/axios'
import { defineStore } from 'pinia'
import { userStore } from './user'
import { useSocket } from '../composables/useSocket'
import { useSaboresStore } from './sabores'

export const useClientStore = defineStore('clientStore', {
  state: () => ({
    pedido: {} as any,
    pedidos: [] as any[]
  }),
  actions: {
    initSocket() {
      const user = userStore()
      const { connect, on } = useSocket()
      connect()

      on('nuevo_pedido', async (payload) => {
        console.log('Nuevo pedido recibido:', payload)
        if (user.isAdmin) {
          await this.pedidos_admin()
        } else {
          await this.update_pedidos()
          const resPuntos = await api.get(`/cliente/puntos/${user.id}`)
          this.pedido = resPuntos.data.data
        }
        this.enviarNotificacion('Nuevo Pedido', `Se ha creado un nuevo pedido`)
      })

      on('cambio_estado', async (payload) => {
        console.log('Cambio de estado:', payload)
        if (user.isAdmin) {
          await this.pedidos_admin()
        } else {
          await this.update_pedidos()
        }
      })

      on('stock_actualizado', async () => {
        console.log('Stock actualizado')
        const saboresStore = useSaboresStore()
        await saboresStore.fetchSabores()
      })

      on('nuevo_cliente', async (payload) => {
        console.log('Nuevo cliente registrado:', payload)
      })

      on('puntos_actualizados', async (payload) => {
        console.log('Puntos actualizados:', payload)
        if (!user.isAdmin) {
          const resPuntos = await api.get(`/cliente/puntos/${user.id}`)
          this.pedido = resPuntos.data.data
        }
      })
    },

    async fetchClientData() {
      const user = userStore()
      try {
        if (user.isAdmin) {
          await this.pedidos_admin()
        } else {
          const [resPuntos] = await Promise.all([api.get(`/cliente/puntos/${user.id}`), this.update_pedidos()])
          this.pedido = await resPuntos.data.data
        }
      } catch (error) {
        console.error('Error cargando datos del cliente:', error)
      }
    },

    async update_pedidos() {
      const user = userStore()
      try {
        const res = await api.get(`/cliente/pedidos-agrupados/${user.id}`)
        this.pedidos = await res.data
      } catch (error) {
        console.error('Error cargando datos del cliente:', error)
      }
    },

    async canjear(idSabor: number) {
      const user = userStore()
      try {
        const res = await api.post('/cliente/canjear', {
          userId: user.id,
          idSabor: idSabor
        })
        await this.fetchClientData()
        return await res.data
      } catch (error) {
        console.error('Error al canjear:', error)
        throw error
      }
    },

    async pedidos_admin() {
      try {
        const res = await api.get('/pedidos')
        this.pedidos = await res.data
      } catch (error) {
        console.error('Error al canjear:', error)
        throw error
      }
    },

    async updateStatus(id_pedido: number, nuevoEstado: string) {
      try {
        const res = await api.patch('/cliente/estado', {
          id_pedido,
          nuevoEstado
        })
        await this.pedidos_admin()
        return await res.data
      } catch (error) {
        console.error('Error actualizando estado:', error)
        throw error
      }
    },

    async enviarNotificacion(titulo: string, cuerpo: string) {
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
  }
})
