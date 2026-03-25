import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { userStore } from '@store/user'

const api = axios.create({
  // baseURL: 'https://api.odeploy.work',
  baseURL: 'https://api.odeploy.work',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')
  if (token) {
    try {
      const decoded: any = jwtDecode(token)
      const currentTime = Math.floor(Date.now() / 1000)

      if (decoded.exp && decoded.exp < currentTime) {
        userStore().logout()
        return Promise.reject(new Error('Token expirado'))
      }

      config.headers.Authorization = `Bearer ${token}`
    } catch (error) {
      userStore().logout()
      return Promise.reject(new Error('Token inválido'))
    }
  }
  return config
})

export { api }
