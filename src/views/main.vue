<script setup lang="ts">
import Sidebar from '@comp/sidebar/sidebar.vue'
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useClientStore } from '@store/cliente'

onMounted(async () => {
  const clientStore = useClientStore()
  await clientStore.initSocket()
  //await clientStore.solicitarPermisoHost()
})
</script>

<template>
  <div class="flex min-h-screen w-full bg-gray-50">
    <Sidebar />

    <main class="flex-1 min-w-0 pb-20 md:pb-0 w-full bg-linear-to-br from-pink-50 via-white to-cyan-50 min-h-screen">
      <RouterView />
    </main>
  </div>
</template>
