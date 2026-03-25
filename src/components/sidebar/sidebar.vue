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
  <div class="hidden md:flex sticky top-0 h-screen w-64 shrink-0 border-r border-gray-100/60 bg-white flex-col z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
    <div class="flex flex-col gap-2 p-5 border-b border-gray-50/50">
      <div class="flex items-center gap-3">
        <span class="text-2xl drop-shadow-sm">🍦</span>
        <div>
          <span class="font-black text-sm block text-gray-900 tracking-tight">Marcianos</span>
          <p class="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Panel Cliente</p>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-3 scrollbar-hide">
      <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3 mt-4">Navegación</div>
      <nav class="flex flex-col gap-2">
        <router-link
          to="/"
          class="nav-item flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
          :class="isActive('/') ? 'bg-pink-50/80 text-pink-600 font-bold hover:bg-pink-100 hover:text-pink-700 shadow-sm border border-pink-100/50' : 'border border-transparent'"
        >
          <Icons.LayoutDashboard class="w-5 h-5 shrink-0" />
          <span>Dashboard</span>
        </router-link>

        <router-link
          to="/pedidos"
          class="nav-item flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
          :class="isActive('/pedidos') ? 'bg-cyan-50/80 text-cyan-600 font-bold hover:bg-cyan-100 hover:text-cyan-700 shadow-sm border border-cyan-100/50' : 'border border-transparent'"
        >
          <Icons.ShoppingBag class="w-5 h-5 shrink-0" />
          <span class="flex-1">Mis Pedidos</span>
        </router-link>
      </nav>
    </div>

    <div class="p-4 border-t border-gray-50/50">
      <div class="flex items-center gap-3 mb-4 px-2">
        <div class="w-8 h-8 rounded-full bg-linear-to-br from-pink-100 to-pink-200 flex items-center justify-center text-xs font-black text-pink-700 shrink-0 shadow-inner">
          {{ user.nombre?.substring(0, 2).toUpperCase() }}
        </div>
        <div class="overflow-hidden min-w-0">
          <p class="text-xs font-bold text-gray-900 truncate tracking-tight">{{ user.nombre }}</p>
          <p class="text-[10px] font-medium text-gray-500 truncate">{{ user.lvl == 2 ? 'Cliente' : 'Administrador' }}</p>
        </div>
      </div>
      <button
        @click="logout"
        class="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm border border-transparent hover:border-red-100"
      >
        <Icons.LogOut class="w-4 h-4" />
        Cerrar Sesión
      </button>
    </div>
  </div>

  <!-- Floating Mobile Navigation -->
  <div
    class="fixed bottom-3 left-3 right-3 z-50 h-[60px] bg-white/95 backdrop-blur-xl border border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-2xl md:hidden flex justify-around items-center px-1 pb-safe"
  >
    <router-link to="/" class="flex flex-col items-center justify-center gap-1 w-14 h-full transition-all" :class="isActive('/') ? 'text-pink-600' : 'text-gray-400 hover:text-gray-600'">
      <div class="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300" :class="isActive('/') ? 'bg-pink-100/80 scale-110' : ''">
        <Icons.LayoutDashboard class="w-4.5 h-4.5" />
      </div>
      <span class="text-[9px] font-bold tracking-tight leading-none" :class="isActive('/') ? 'text-pink-600' : 'font-medium'">Inicio</span>
    </router-link>

    <router-link
      to="/pedidos"
      class="flex flex-col items-center justify-center gap-1 w-14 h-full transition-all"
      :class="isActive('/pedidos') ? 'text-cyan-600' : 'text-gray-400 hover:text-gray-600'"
    >
      <div class="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300" :class="isActive('/pedidos') ? 'bg-cyan-100/80 scale-110' : ''">
        <Icons.ShoppingBag class="w-4.5 h-4.5" />
        <span
          class="absolute top-0 right-0 bg-pink-500 text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold shadow-sm border border-white"
          >3</span
        >
      </div>
      <span class="text-[9px] font-bold tracking-tight leading-none" :class="isActive('/pedidos') ? 'text-cyan-600' : 'font-medium'">Pedidos</span>
    </router-link>

    <button @click="logout" class="flex flex-col items-center justify-center gap-1 w-14 h-full text-gray-400 hover:text-red-500 transition-colors">
      <div class="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 hover:scale-110 transition-all duration-300">
        <Icons.LogOut class="w-4.5 h-4.5" />
      </div>
      <span class="text-[9px] font-bold tracking-tight leading-none">Salir</span>
    </button>
  </div>
</template>
