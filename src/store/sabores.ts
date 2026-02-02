import { defineStore } from 'pinia'
import { api } from '@api/axios'
import { ref } from 'vue'

export const useSaboresStore = defineStore('saboresStore', () => {
  const sabores = ref<Array<any>>()
  const isLoading = ref(false)

  const fetchSabores = async () => {
    isLoading.value = true
    try {
      const { data } = await api.get('/sabor')
      sabores.value = data
    } catch (error) {
      console.error('Error fetching sabores:', error)
    } finally {
      isLoading.value = false
    }
  }

  const createSabor = async (sabor: object) => {
    try {
      await api.post('/sabor/nuevo', sabor)
      await fetchSabores()
    } catch (error) {
      console.error('Error creating sabor:', error)
      throw error
    }
  }

  return {
    sabores,
    isLoading,
    fetchSabores,
    createSabor
  }
})
