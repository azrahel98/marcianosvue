import { defineStore } from 'pinia'
import { api } from '@api/axios'

export const useSaboresStore = defineStore('saboresStore', {
  state: () => ({
    sabores: [] as any[],
    isLoading: false
  }),
  actions: {
    async fetchSabores() {
      this.isLoading = true
      try {
        const { data } = await api.get('/sabor')
        this.sabores = await data
      } catch (error) {
        console.error('Error fetching sabores:', error)
      } finally {
        this.isLoading = false
      }
    },

    async createSabor(sabor: object) {
      try {
        await api.post('/sabor/nuevo', sabor)
        await this.fetchSabores()
      } catch (error) {
        console.error('Error creating sabor:', error)
        throw error
      }
    },

    async registrarMovimiento(idSabor: number, cantidad: number, tipo: string) {
      try {
        await api.post('/pedidos/movimiento', {
          idSabor,
          cantidad,
          tipo
        })
        await this.fetchSabores()
      } catch (error) {
        console.error('Error recording movement:', error)
        throw error
      }
    }
  }
})
