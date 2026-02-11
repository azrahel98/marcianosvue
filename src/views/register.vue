<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
    <div class="absolute top-10 left-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl"></div>
    <div class="absolute top-1/4 right-20 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl"></div>
    <div class="absolute bottom-1/4 left-20 w-20 h-20 bg-pink-400/20 rounded-full blur-xl"></div>
    <div class="absolute bottom-10 right-10 w-28 h-28 bg-orange-400/20 rounded-full blur-xl"></div>

    <div class="w-full max-w-[340px] relative z-10 px-4">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-black bg-linear-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent mb-1">Marcianos</h1>
        <p class="text-xs text-gray-500 font-medium">Únete a nosotros</p>
      </div>

      <div data-slot="card" class="bg-white/80 backdrop-blur-sm flex flex-col gap-4 p-6 shadow-xl border border-pink-100 rounded-2xl">
        <form @submit.prevent="handleRegister" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Nombre Completo</label>
            <input
              v-model="form.nombre"
              data-slot="input"
              class="h-8 w-full rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
              :class="{ 'border-red-500': errors.nombre }"
              placeholder="Juan Pérez"
              type="text"
            />
            <p v-if="errors.nombre" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.nombre }}</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico</label>
            <input
              v-model="form.email"
              data-slot="input"
              class="h-8 w-full rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
              :class="{ 'border-red-500': errors.email }"
              placeholder="tu@email.com"
              type="email"
            />
            <p v-if="errors.email" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.email }}</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Instrucciones de entrega</label>
            <input
              v-model="form.instrucciones_entrega"
              data-slot="input"
              class="h-8 w-full rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
              :class="{ 'border-red-500': errors.instrucciones_entrega }"
              placeholder="Instrucciones de entrega"
              type="text"
            />
            <p v-if="errors.instrucciones_entrega" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.instrucciones_entrega }}</p>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Contraseña</label>
            <input
              v-model="form.contrasena"
              data-slot="input"
              class="h-8 w-full rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
              :class="{ 'border-red-500': errors.contrasena }"
              placeholder="••••••••"
              type="password"
            />
            <p v-if="errors.contrasena" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.contrasena }}</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Confirmar Contraseña</label>
            <input
              v-model="form.confirmPassword"
              data-slot="input"
              class="h-8 w-full rounded-lg bg-gray-50 border border-gray-200 px-3 text-xs focus:border-pink-500 focus:ring-1 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
              :class="{ 'border-red-500': errors.confirmPassword }"
              placeholder="••••••••"
              type="password"
            />
            <p v-if="errors.confirmPassword" class="text-[10px] text-red-500 mt-1 font-medium">{{ errors.confirmPassword }}</p>
          </div>

          <div v-if="apiError" class="p-2 bg-red-50 border border-red-100 rounded-lg">
            <p class="text-[10px] text-red-600 text-center font-medium">{{ apiError }}</p>
          </div>

          <button
            data-slot="button"
            class="h-9 w-full bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-lg text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            type="submit"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Registrando...</span>
            <span v-else>Registrarse</span>
          </button>
        </form>

        <div class="mt-2 pt-4 border-t border-gray-100">
          <p class="text-xs text-gray-500 text-center mb-3 font-medium">¿Ya tienes cuenta?</p>
          <a href="/login" class="block">
            <button data-slot="button" class="h-8 w-full bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 font-bold rounded-lg text-xs transition-all">
              Iniciar Sesión
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { api } from '@api/axios'
import { z } from 'zod'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
const apiError = ref('')

const registerSchema = z
  .object({
    nombre: z.string().min(2, 'Ingresa tu nombre completo'),
    email: z.string().email('Correo inválido'),
    contrasena: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
    instrucciones_entrega: z.string().min(6, 'Mínimo 6 caracteres')
  })
  .refine((data) => data.contrasena === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

const form = reactive({
  nombre: '',
  email: '',
  contrasena: '',
  confirmPassword: '',
  instrucciones_entrega: ''
})

const errors = reactive({
  nombre: '',
  email: '',
  contrasena: '',
  confirmPassword: '',
  instrucciones_entrega: ''
})

const handleRegister = async () => {
  errors.nombre = ''
  errors.email = ''
  errors.contrasena = ''
  errors.confirmPassword = ''
  errors.instrucciones_entrega = ''
  apiError.value = ''

  const result = registerSchema.safeParse(form)

  if (!result.success) {
    result.error.issues.forEach((issue: z.ZodIssue) => {
      if (issue.path[0] === 'nombre') errors.nombre = issue.message
      if (issue.path[0] === 'email') errors.email = issue.message
      if (issue.path[0] === 'contrasena') errors.contrasena = issue.message
      if (issue.path[0] === 'confirmPassword') errors.confirmPassword = issue.message
      if (issue.path[0] === 'instrucciones_entrega') errors.instrucciones_entrega = issue.message
    })
    return
  }

  try {
    isLoading.value = true

    const { confirmPassword, ...registerData } = form
    const { data } = await api.post('/registro', registerData)

    if (data.token) {
      localStorage.setItem('jwt', data.token)
      await router.push({ name: 'dashboard' })
    } else {
      await router.push({ name: 'login' })
    }
  } catch (error: any) {
    console.error(error)
    if (error.response?.data?.message) {
      apiError.value = error.response.data.message
    } else {
      apiError.value = 'Error al registrarse. Intente nuevamente.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
