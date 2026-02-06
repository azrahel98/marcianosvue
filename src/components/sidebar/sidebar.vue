<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useUIStore } from '@store/ui'
import * as Icons from '@comp/icons'
import { userStore } from '@store/user'

const router = useRouter()
const route = useRoute()
const uiStore = useUIStore()
const user = userStore()

// Solo funciones de utilidad
const logout = () => {
  localStorage.clear()
  router.push('/login')
}

const isActive = (path: string) => route.path === path
</script>

<template>
  <div class="fixed inset-y-0 z-20 h-svh w-64 hidden md:flex left-0 border-r border-gray-100 bg-white flex-col">
    <div class="flex flex-col gap-2 p-4 border-b border-gray-50">
      <div class="flex items-center gap-2">
        <span class="text-xl">🍦</span>
        <div>
          <span class="font-bold text-sm block text-gray-900">Marcianos</span>
          <p class="text-[10px] font-medium text-gray-500">Panel Cliente</p>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-2">
      <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2 mt-2">Navegación</div>
      <nav class="flex flex-col gap-1">
        <router-link to="/" class="nav-item" :class="{ active: isActive('/') }">
          <Icons.LayoutDashboard class="w-4 h-4" />
          <span>Dashboard</span>
        </router-link>

        <router-link to="/pedidos" class="nav-item" :class="{ active: isActive('/pedidos') }">
          <Icons.ShoppingBag class="w-4 h-4" />
          <span class="flex-1">Mis Pedidos</span>
        </router-link>

        <!-- <router-link to="/perfil" class="nav-item" :class="{ active: isActive('/perfil') }">
          <Icons.User class="w-4 h-4" />
          <span>Mi Perfil</span>
        </router-link> -->
      </nav>
    </div>

    <div class="p-4 border-t border-gray-50">
      <div class="flex items-center gap-3 mb-4 px-2">
        <div class="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600">
          {{ user.nombre?.substring(0, 2).toUpperCase() }}
        </div>
        <div class="overflow-hidden">
          <p class="text-xs font-bold text-gray-900 truncate">{{ user.nombre }}</p>
          <p class="text-[10px] text-gray-500 truncate">{{ user.lvl == 2 ? 'Cliente' : 'Admin' }}</p>
        </div>
      </div>
      <button @click="logout" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
        <Icons.LogOut class="w-3.5 h-3.5" />
        Cerrar Sesión
      </button>
    </div>
  </div>

  <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden flex justify-around items-center px-1 pb-safe">
    <router-link to="/" class="mobile-item" :class="{ 'text-pink-600': isActive('/') }">
      <Icons.LayoutDashboard class="w-5 h-5" />
      <span>Inicio</span>
    </router-link>

    <router-link to="/pedidos" class="mobile-item" :class="{ 'text-pink-600': isActive('/pedidos') }">
      <div class="relative">
        <Icons.ShoppingBag class="w-5 h-5" />
        <span class="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full">3</span>
      </div>
      <span>Pedidos</span>
    </router-link>

    <button @click="logout" class="mobile-item text-gray-400">
      <Icons.LogOut class="w-5 h-5" />
      <span>Salir</span>
    </button>
  </div>
</template>
