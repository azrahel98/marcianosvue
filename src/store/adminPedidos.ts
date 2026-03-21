import { api } from '@api/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminPedidosStore = defineStore('adminPedidosStore', () => {
  const clientes = ref<any[]>([])
  
  const obtenerListaClientes = async () => {
    try {
      const res = await api.get('/cliente/todos')
      if (res.data.success) {
        clientes.value = res.data.data
      }
    } catch (error) {
      console.error('Error cargando lista de clientes:', error)
    }
  }

  const crearPedidoParaCliente = async (userId: number, productos: {idSabor: number, cantidad: number}[], estado: string = 'pendiente') => {
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

  return { clientes, obtenerListaClientes, crearPedidoParaCliente }
})
