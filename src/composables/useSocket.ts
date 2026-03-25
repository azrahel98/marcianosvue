import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

const socket = ref<Socket | null>(null)
const connected = ref(false)

const SOCKET_URL = 'https://api.odeploy.work'

export function useSocket() {
  const connect = () => {
    if (socket.value?.connected) return

    socket.value = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    })

    socket.value.on('connect', () => {
      connected.value = true
      console.log('Socket.IO conectado:', socket.value?.id)
    })

    socket.value.on('disconnect', () => {
      connected.value = false
      console.log('Socket.IO desconectado')
    })
  }

  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
    connected.value = false
  }

  const on = (event: string, callback: (data: any) => void) => {
    socket.value?.on(event, callback)
  }

  return { socket, connected, connect, disconnect, on }
}
