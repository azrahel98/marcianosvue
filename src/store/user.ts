import { router } from '@router/router'
import { jwtDecode } from 'jwt-decode'
import { defineStore } from 'pinia'

export const userStore = defineStore('userStore', {
  state: () => ({ exp: 0, lvl: 0, id: '', nombre: '' }),
  getters: {
    isAdmin: (state) => state.lvl === 1
  },
  actions: {
    create(token: string) {
      try {
        const decoded: any = jwtDecode(token)
        const currentTime = Math.floor(Date.now() / 1000)

        if (decoded.exp && decoded.exp < currentTime) {
          this.logout()
          return
        }
        this.id = decoded.id_usuario
        this.exp = decoded.exp!
        this.lvl = decoded.rol === 'admin' ? 1 : 2
        this.nombre = decoded.nombre
      } catch (error) {
        this.logout()
      }
    },
    async logout() {
      localStorage.clear()
      router.go(0)
    }
  }
})
