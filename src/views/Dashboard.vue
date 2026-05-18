<!-- src/views/Dashboard.vue -->
<template>
  <div class="max-w-7xl mx-auto">
    <!-- 欢迎卡片 -->
    <div class="mb-6 animate-float">
      <div class="glass rounded-2xl p-5 shadow-glass">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
            <span class="text-xl">👋</span>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-800">欢迎回来</h1>
            <p class="text-xs text-gray-500">你的阅读之旅还在继续</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 加载骨架屏 -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="skeleton h-28 rounded-2xl"></div>
    </div>
    
    <div v-else>
      <!-- 统计卡片 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="glass rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <span class="text-2xl">📚</span>
            <span class="text-xs px-1.5 py-0.5 bg-primary-100 text-primary-600 rounded-full">总计</span>
          </div>
          <div class="text-2xl font-bold text-gray-800 mt-1">{{ shelfTotal }}</div>
          <div class="text-xs text-gray-500">书架藏书</div>
          <div class="text-xs text-gray-400 mt-1">电子书 {{ bookCount }} 本</div>
        </div>
        
        <div class="glass rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <span class="text-2xl">✏️</span>
            <span class="text-xs px-1.5 py-0.5 bg-primary-100 text-primary-600 rounded-full">总计</span>
          </div>
          <div class="text-2xl font-bold text-gray-800 mt-1">{{ noteTotal }}</div>
          <div class="text-xs text-gray-500">笔记总数</div>
          <div class="text-xs text-gray-400 mt-1">划线 + 想法</div>
        </div>
        
        <div class="glass rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <span class="text-2xl">📅</span>
            <span class="text-xs px-1.5 py-0.5 bg-primary-100 text-primary-600 rounded-full">本月</span>
          </div>
          <div class="text-2xl font-bold text-gray-800 mt-1">{{ readDays }}</div>
          <div class="text-xs text-gray-500">阅读天数</div>
          <div class="text-xs text-gray-400 mt-1">共 {{ totalTimeFormatted }}</div>
        </div>
        
        <div class="glass rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <span class="text-2xl">⏱️</span>
            <span class="text-xs px-1.5 py-0.5 bg-primary-100 text-primary-600 rounded-full">日均</span>
          </div>
          <div class="text-2xl font-bold text-gray-800 mt-1">{{ avgTimeFormatted }}</div>
          <div class="text-xs text-gray-500">平均阅读时长</div>
          <div class="text-xs text-gray-400 mt-1">较上期 {{ comparePercent }}</div>
        </div>
      </div>
      
      <!-- 最近阅读区域 -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-md font-semibold text-gray-800">📖 最近阅读</h2>
          <router-link to="/shelf" class="text-xs text-primary-600">查看全部 →</router-link>
        </div>
        
        <div v-if="recentBooks.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          <div v-for="book in recentBooks" :key="book.bookId" 
               class="glass rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
               @click="goToBookDetail(book.bookId)">
            <img :src="book.cover" :alt="book.title" class="w-full aspect-[3/4] object-cover">
            <div class="p-2 relative">
              <!-- 读完标志 -->
              <div v-if="book.finishReading" class="absolute top-0 right-0 mt-1 mr-1">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-600 text-white shadow-sm">
                  ✓ 已读完
                </span>
              </div>
              <h3 class="font-medium text-xs line-clamp-1 text-gray-800 pr-12">{{ book.title }}</h3>
              <p class="text-xs text-gray-500 truncate mt-0.5">{{ book.author }}</p>
              <div class="mt-2 flex items-center gap-1">
                <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">
                  <span>📅</span> {{ book.lastReadTime }}
                </span>
                <span v-if="!book.finishReading" class="text-xs text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">继续阅读 →</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="glass rounded-xl p-8 text-center text-gray-400 text-sm">
          暂无阅读记录，去书架添加书籍吧～
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProfileOverview } from '../api/weread.js'

const router = useRouter()

const loading = ref(true)
const shelfTotal = ref(0)
const bookCount = ref(0)
const readDays = ref(0)
const totalTimeFormatted = ref('0')
const avgTimeFormatted = ref('0')
const comparePercent = ref('')
const noteTotal = ref(0)
const recentBooks = ref([])

const goToBookDetail = (bookId) => {
  router.push(`/book/${bookId}`)
}

onMounted(async () => {
  try {
    const profile = await getProfileOverview()
    
    shelfTotal.value = profile.shelfStats?.totalCount || 0
    bookCount.value = profile.shelfStats?.bookCount || 0
    readDays.value = profile.readingStats?.thisMonthReadDays || 0
    totalTimeFormatted.value = profile.readingStats?.thisMonthTotalTimeFormatted || '0'
    avgTimeFormatted.value = profile.readingStats?.thisMonthAvgTimeFormatted || '0'
    recentBooks.value = profile.recentBooks || []
    
    if (profile.compare !== undefined) {
      const compare = profile.compare
      const percent = Math.abs(compare * 100).toFixed(0)
      comparePercent.value = compare > 0 ? `↑ ${percent}%` : compare < 0 ? `↓ ${percent}%` : '持平'
    } else {
      comparePercent.value = '—'
    }
    
  } catch (error) {
    console.error('加载首页数据失败:', error)
  } finally {
    loading.value = false
  }
})
</script>