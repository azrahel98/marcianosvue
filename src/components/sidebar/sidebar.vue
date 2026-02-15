<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import * as Icons from '@comp/icons'
import { userStore } from '@store/user'

const router = useRouter()
const route = useRoute()
const user = userStore()

const logout = () => {
  localStorage.clear()
  router.push('/login')
}

const isActive = (path: string) => route.path === path
</script>

<template>
  <div class="hidden md:flex sticky top-0 h-screen w-60 shrink-0 border-r border-gray-100 bg-white flex-col z-30">
    <div class="flex flex-col gap-2 p-3 border-b border-gray-50">
      <div class="flex items-center gap-2">
        <span class="text-lg">🍦</span>
        <div>
          <span class="font-bold text-xs block text-gray-900">Marcianos</span>
          <p class="text-[9px] font-medium text-gray-500">Panel Cliente</p>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-2 scrollbar-hide">
      <div class="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2 mt-2">Navegación</div>
      <nav class="flex flex-col gap-0.5">
        <router-link to="/" class="nav-item text-xs py-1.5" :class="{ active: isActive('/') }">
          <Icons.LayoutDashboard class="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </router-link>

        <router-link to="/pedidos" class="nav-item text-xs py-1.5" :class="{ active: isActive('/pedidos') }">
          <Icons.ShoppingBag class="w-3.5 h-3.5" />
          <span class="flex-1">Mis Pedidos</span>
        </router-link>
      </nav>
    </div>

    <div class="p-3 border-t border-gray-50">
      <div class="flex items-center gap-2 mb-3 px-1">
        <div class="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-[10px] font-bold text-pink-600 shrink-0">
          {{ user.nombre?.substring(0, 2).toUpperCase() }}
        </div>
        <div class="overflow-hidden min-w-0">
          <p class="text-[11px] font-bold text-gray-900 truncate">{{ user.nombre }}</p>
          <p class="text-[9px] text-gray-500 truncate">{{ user.lvl == 2 ? 'Cliente' : 'Admin' }}</p>
        </div>
      </div>
      <button @click="logout" class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
        <Icons.LogOut class="w-3 h-3" />
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
