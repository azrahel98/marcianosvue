<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  sabores: any[]
}>()

const emit = defineEmits(['addProduct'])

const searchQuery = ref('')
const activeCategory = ref('Todos')

const categories = [
  { id: 'Todos', name: 'Todos', icon: '🧊' },
  { id: 'Frutas', name: 'Frutas', icon: '🍓' },
  { id: 'Leche', name: 'Leche', icon: '🥛' },
  { id: 'Especiales', name: 'Especiales', icon: '✨' }
]

const filteredSabores = computed(() => {
  let list = props.sabores || []

  // Simulate generic categories since API might not return categories natively
  // We'll just filter by name somewhat or treat everything as valid to keep the UI
  if (activeCategory.value !== 'Todos') {
    if(activeCategory.value === 'Frutas') list = list.filter((s:any) => s.nombre.toLowerCase().match(/fresa|maracuya|mango|limon|lucuma|chicha/))
    else if(activeCategory.value === 'Leche') list = list.filter((s:any) => s.nombre.toLowerCase().match(/leche|chocolate|vainilla|coco|oreo/))
    else if(activeCategory.value === 'Especiales') list = list.filter((s:any) => !s.nombre.toLowerCase().match(/fresa|maracuya|mango|limon|lucuma|chicha|leche|chocolate|vainilla|coco|oreo/))
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((s: any) => s.nombre.toLowerCase().includes(q))
  }

  return list
})
</script>

<template>
  <div class="h-auto lg:h-full flex flex-col pt-1 lg:pl-4 pl-0 w-full lg:overflow-hidden overflow-visible">
    
    <!-- Top Bar: Date/Time (Simulated static or simple) -->
    <div class="flex items-center justify-between mb-4 shrink-0 flex-wrap gap-2">
      <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-xs border border-border/50 flex-1 lg:flex-none justify-center lg:justify-start">
         <span class="text-[11px] font-bold text-gray-600 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {{ new Date().toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'}) }}
         </span>
      </div>

      <div class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-xs border border-border/50 shrink-0">
        <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
        <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Pedido Activo</span>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="overflow-x-auto custom-scrollbar-horizontal pb-2 shrink-0 -mx-1 px-1">
      <div class="flex gap-2 min-w-max">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all border outline-none group text-xs font-bold"
          :class="activeCategory === cat.id ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 border-primary' : 'bg-white text-gray-500 border-border/80 hover:border-primary/30'"
        >
          <span>{{ cat.icon }}</span>
          <span>{{ cat.name }}</span>
        </button>
      </div>
    </div>

    <!-- Search input -->
    <div class="relative w-full mb-4 shrink-0 mt-1">
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
      <input
        type="search"
        v-model="searchQuery"
        placeholder="Busca tu sabor favorito..."
        class="w-full bg-white border border-border/70 h-9 rounded-xl pl-3 pr-10 text-[11px] font-medium text-gray-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs transition-all"
      />
    </div>

    <!-- Products Grid -->
    <div class="flex-1 lg:overflow-y-auto overflow-visible pb-4 pr-1 -mr-1 custom-scrollbar">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-4">
        <div
          v-for="sabor in filteredSabores"
          :key="sabor.id_sabor"
          @click="$emit('addProduct', sabor)"
          class="bg-white rounded-2xl p-2.5 border border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-px hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
          :class="sabor.stock === 0 ? 'opacity-60 grayscale cursor-not-allowed pointer-events-none' : ''"
        >
          <!-- Minimalist image placeholder -->
          <div class="w-full h-20 bg-secondary/5 rounded-xl mb-2.5 flex items-center justify-center relative overflow-hidden group-hover:bg-primary/5 transition-colors border border-border/40">
             <span class="text-2xl transition-transform group-hover:scale-110 duration-500 block">🧊</span>
          </div>

          <div class="flex flex-col gap-0.5 mt-auto">
             <h3 class="text-[11px] font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors truncate">{{ sabor.nombre }}</h3>
             
             <div class="flex items-center justify-between mt-1.5 flex-wrap gap-1">
               <!-- Badge -->
               <span class="px-1.5 py-[1px] rounded text-[8px] font-bold" :class="sabor.stock === 0 ? 'bg-destructive/10 text-destructive' : 'bg-secondary/10 text-secondary'">
                  {{ sabor.stock === 0 ? 'Agotado' : 'Disponible' }}
               </span>
               <span class="text-[11px] font-black text-gray-900">S/ {{ Number(sabor.precio).toFixed(2) }}</span>
             </div>
          </div>
          
          <div v-if="sabor.stock === 0" class="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px] z-20">
             <span class="bg-destructive text-destructive-foreground px-2 py-0.5 rounded-md text-[9px] font-black shadow-xs origin-center -rotate-12">AGOTADO</span>
          </div>
        </div>
        
        <div v-if="filteredSabores.length === 0" class="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-50"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
           <span class="font-bold">No se encontraron productos</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
}

.custom-scrollbar-horizontal::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar-horizontal::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 10px;
}
</style>
