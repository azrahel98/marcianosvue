import { api } from '@api/axios'
import { defineStore } from 'pinia'

export const useAdminPedidosStore = defineStore('adminPedidosStore', {
  state: () => ({
    clientes: [] as any[]
  }),
  actions: {
    async obtenerListaClientes() {
      try {
        const res = await api.get('/cliente/todos')
        if (res.data.success) {
          this.clientes = res.data.data
        }
      } catch (error) {
        console.error('Error cargando lista de clientes:', error)
      }
    },

    async crearPedidoParaCliente(userId: number, productos: {idSabor: number, cantidad: number}[], estado: string = 'pendiente') {
      try {
        const res = await api.post('/pedidos/admin/crear', {
          userId,
          productos,
          estado
        })
        return res.data
      } catch (error) {
        console.error('Error al crear pedido de admin:', error)
        throw error
      }
    }
  }
})
