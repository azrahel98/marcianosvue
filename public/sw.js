// public/sw.js
self.addEventListener('push', (event) => {
  // Este archivo puede estar vacío de lógica por ahora, 
  // pero debe existir y estar registrado.
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  // Abrir la app al hacer clic en la notificación
  event.waitUntil(
    clients.openWindow('/')
  )
})