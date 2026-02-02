<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUIStore } from '@store/ui'
import * as Icons from '@comp/icons'
import { userStore } from '@store/user'

// Interface for Menu Items
interface MenuItem {
  title: string
  icon: any
  to?: string
  badge?: number | string
  badgeColor?: string // 'bg-pink-500', 'bg-cyan-500' etc.
  children?: MenuItem[]
  isOpen?: boolean
}

const router = useRouter()
const route = useRoute()
const uiStore = useUIStore()
const user = userStore()

// State for menu
const menuItems = ref<MenuItem[]>([
  {
    title: 'Mi Dashboard',
    icon: Icons.LayoutDashboard,
    to: '/dashboard/cliente'
  },
  {
    title: 'Mis Pedidos',
    icon: Icons.ShoppingBag,
    to: '/dashboard/cliente/orders',
    badge: 3,
    badgeColor: 'bg-pink-500 text-white'
  },
  {
    title: 'Recompensas',
    icon: Icons.Gift,
    to: '/dashboard/cliente/rewards'
  },
  {
    title: 'Gestionar Pedidos',
    icon: Icons.ClipboardList,
    to: '/pedidos'
  },
  {
    title: 'Mi Cuenta',
    icon: Icons.User,
    isOpen: false,
    children: [
      {
        title: 'Perfil',
        icon: Icons.User, // reusing user icon or dot
        to: '/dashboard/cliente/profile'
      }
    ]
  }
])

router.afterEach(() => {
  uiStore.closeSidebar()
})

const logout = () => {
  localStorage.clear()
  router.push('/login')
}

const toggleSubmenu = (item: MenuItem) => {
  if (item.children) {
    item.isOpen = !item.isOpen
  } else if (item.to) {
    router.push(item.to)
  }
}

const isActive = (item: MenuItem) => {
  if (item.to) {
    return route.path === item.to || route.path.startsWith(item.to + '/')
  }
  if (item.children) {
    return item.children.some((child) => child.to && (route.path === child.to || route.path.startsWith(child.to + '/')))
  }
  return false
}
</script>

<template>
  <!-- Desktop Sidebar -->
  <div
    data-slot="sidebar-gap"
    class="relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 group-data-[collapsible=icon]:w-(--sidebar-width-icon) hidden md:block"
  ></div>
  <div
    data-slot="sidebar-container"
    class="fixed inset-y-0 z-20 h-svh w-(--sidebar-width) transition-transform duration-200 ease-linear hidden md:flex left-0 border-r border-gray-100 bg-white"
  >
    <div data-sidebar="sidebar" data-slot="sidebar-inner" class="bg-sidebar flex h-full w-64 flex-col">
      <div data-slot="sidebar-header" class="flex flex-col gap-2 p-4 border-b border-gray-50">
        <div class="flex items-center gap-2">
          <span class="text-xl">🍦</span>
          <div>
            <span class="font-bold text-sm block text-gray-900">Marcianos</span>
            <p class="text-[10px] font-medium text-gray-500">Cliente</p>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-2">
        <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2 mt-2">Navegación</div>
        <ul class="flex flex-col gap-1">
          <li v-for="(item, index) in menuItems" :key="index">
            <!-- Item with Submenu or just Link -->
            <div
              @click="toggleSubmenu(item)"
              class="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors relative select-none"
              :class="[isActive(item) && !item.children ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
            >
              <component :is="item.icon" class="w-4 h-4 shrink-0" />
              <span class="flex-1 truncate">{{ item.title }}</span>

              <!-- Badge -->
              <span v-if="item.badge" class="px-1.5 py-0.5 rounded-full text-[10px] font-bold" :class="item.badgeColor || 'bg-gray-100 text-gray-600'">
                {{ item.badge }}
              </span>

              <!-- Chevron for submenu -->
              <component v-if="item.children" :is="item.isOpen ? Icons.ChevronDown : Icons.ChevronRight" class="w-4 h-4 text-gray-400" />
            </div>

            <!-- Submenu -->
            <ul v-if="item.children && item.isOpen" class="ml-4 mt-1 pl-2 border-l border-gray-100 flex flex-col gap-1">
              <li v-for="(child, childIndex) in item.children" :key="childIndex">
                <router-link
                  :to="child.to || '#'"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  :class="[isActive(child) ? 'text-pink-600 bg-pink-50/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50']"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-current opacity-40"></span>
                  {{ child.title }}
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div data-slot="sidebar-footer" class="p-4 border-t border-gray-50">
        <div class="flex items-center gap-3 mb-4 px-2">
          <div class="w-8 h-8 rounded-full bg-linear-to-br from-pink-100 to-cyan-100 flex items-center justify-center text-xs font-bold text-gray-600">JG</div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-gray-900 truncate">{{ user.nombre }}</p>
            <p class="text-[10px] text-gray-500 truncate">{{ user.lvl == 2 ? 'Cliente' : 'Administrador' }}</p>
          </div>
        </div>
        <button @click="logout" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors">
          <Icons.LogOut class="w-3.5 h-3.5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Bottom Menu -->
  <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden flex justify-around items-center px-1 pb-safe">
    <template v-for="(item, index) in menuItems" :key="index">
      <!-- Only show top-level items that have a link -->
      <router-link
        v-if="item.to"
        :to="item.to"
        class="relative flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-pink-600 transition-colors gap-1 min-w-0"
        :class="{ 'text-pink-600': isActive(item) }"
      >
        <div class="relative">
          <component :is="item.icon" class="w-5 h-5" />
          <span
            v-if="item.badge"
            class="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] flex items-center justify-center rounded-full text-[9px] font-bold border border-white"
            :class="item.badgeColor || 'bg-red-500 text-white'"
          >
            {{ item.badge }}
          </span>
        </div>
        <span class="text-[10px] font-medium truncate max-w-[60px]">{{ item.title.split(' ')[0] }}</span>
        <!-- Using first word for mobile label to save space, or use a shorter mobileTitle prop if we added one -->
      </router-link>
    </template>

    <button @click="logout" class="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-red-600 transition-colors gap-1 min-w-0">
      <Icons.LogOut class="w-5 h-5" />
      <span class="text-[10px] font-medium">Salir</span>
    </button>
  </div>
</template>
