import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('uiStore', () => {
  const isSidebarOpen = ref(false)

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar
  }
})
