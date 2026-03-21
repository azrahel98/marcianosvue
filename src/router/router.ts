import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router'

import { userStore } from '@store/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@views/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@views/register.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@views/main.vue'),
    beforeEnter: (to, from, next) => middleware(to, from, next),
    children: [
      {
        path: '/',
        name: 'dashboard',
        component: () => import('@views/dash/home.vue')
      },
      {
        path: '/pedidos',
        name: 'pedidos',
        component: () => import('@views/dash/pedidos.vue')
      }
    ]
  }
]

const middleware = (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const token = localStorage.getItem('jwt')
  
  if (!token) {
    return next({ name: 'login' })
  }

  const store = userStore()
  
  if (!store.id) {
    store.create(token)
  } else {
    const currentTime = Math.floor(Date.now() / 1000)
    if (store.exp < currentTime) {
      store.logout()
      return next(false)
    }
  }

  return next()
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: 'bg-primary/10 text-primary font-bold underline',
  linkActiveClass: ' '
})
