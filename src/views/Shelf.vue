<!-- src/views/Shelf.vue -->
<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📚 我的书架
          <span class="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{{ books.length }} 本</span>
        </h1>
        <p class="text-sm text-gray-500 mt-1">读过的书，都会成为你的气质</p>
      </div>
      <button @click="refresh" class="glass px-4 py-2 rounded-xl text-sm text-gray-600 hover:text-primary-600 transition-colors">
        🔄 刷新
      </button>
    </div>
    
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div v-for="i in 10" :key="i" class="skeleton rounded-2xl aspect-[2/3]"></div>
    </div>
    
    <div v-else>
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button v-for="tab in tabs" :key="tab.key" 
                @click="activeTab = tab.key"
                :class="['px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all', 
                         activeTab === tab.key ? 'bg-primary-600 text-white shadow-lg' : 'glass text-gray-600']">
          {{ tab.label }}
        </button>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        <div v-for="book in filteredBooks" :key="book.bookId" class="group cursor-pointer" @click="goToBookDetail(book.bookId)">
          <div class="relative overflow-hidden rounded-2xl shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
            <img :src="book.cover" :alt="book.title" class="w-full aspect-[2/3] object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span class="text-white text-sm font-medium">📖 查看详情</span>
            </div>
            <div v-if="book.finishReading" class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              读完
            </div>
          </div>
          <div class="mt-2">
            <h3 class="font-medium text-sm line-clamp-1 text-gray-800">{{ book.title }}</h3>
            <p class="text-xs text-gray-400">{{ book.author }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="filteredBooks.length === 0" class="glass rounded-2xl p-12 text-center text-gray-400">
        📭 暂无书籍，快去书城逛逛吧～
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getShelf } from '../api/weread.js'

const router = useRouter()

const loading = ref(true)
const books = ref([])
const activeTab = ref('all')
const tabs = [
  { key: 'all', label: '全部' },
  { key: 'reading', label: '在读' },
  { key: 'finished', label: '读完' },
]

const filteredBooks = computed(() => {
  if (activeTab.value === 'reading') return books.value.filter(b => !b.finishReading)
  if (activeTab.value === 'finished') return books.value.filter(b => b.finishReading)
  return books.value
})

const fetchShelf = async () => {
  loading.value = true
  try {
    const data = await getShelf()
    books.value = data.books || []
  } catch (error) {
    console.error('获取书架失败:', error)
  } finally {
    loading.value = false
  }
}

const refresh = () => fetchShelf()

// 跳转到书籍详情页
const goToBookDetail = (bookId) => {
  router.push(`/book/${bookId}`)
}

onMounted(fetchShelf)
</script>