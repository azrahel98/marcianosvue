<script setup lang="ts">
import Sidebar from '@comp/sidebar/sidebar.vue'
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useClientStore } from '@store/cliente'
import { useSaboresStore } from '@store/sabores'

const clientStore = useClientStore()
const saboresStore = useSaboresStore()

onMounted(async () => {
  await clientStore.initSocket()
  await saboresStore.fetchSabores()

  await clientStore.fetchClientData()
})
</script>

<template>
  <div class="flex min-h-screen w-full bg-gray-50 font-sans text-gray-900">
    <Sidebar />

    <main class="flex-1 min-w-0 pb-20 md:pb-0 w-full bg-linear-to-br from-pink-50/40 via-white to-cyan-50/40 min-h-screen">
      <RouterView />
    </main>
  </div>
</template>
