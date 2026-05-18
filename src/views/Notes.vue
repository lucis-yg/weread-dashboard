<!-- src/views/Notes.vue -->
<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        ✏️ 我的笔记
        <span class="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{{ totalNotes }} 条</span>
      </h1>
      <p class="text-sm text-gray-500 mt-1">记录思考，沉淀智慧</p>
    </div>
    
    <!-- 我的笔记区域 -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="skeleton h-32 rounded-2xl"></div>
    </div>
    
    <div v-else>
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="glass rounded-xl p-3 text-center">
          <div class="text-primary-600 text-lg">{{ totalBooks }}</div>
          <div class="text-xs text-gray-500">有笔记的书</div>
        </div>
        <div class="glass rounded-xl p-3 text-center">
          <div class="text-green-500 text-lg">{{ totalUnderlines }}</div>
          <div class="text-xs text-gray-500">划线</div>
        </div>
        <div class="glass rounded-xl p-3 text-center">
          <div class="text-orange-500 text-lg">{{ totalReviews }}</div>
          <div class="text-xs text-gray-500">想法</div>
        </div>
      </div>
      
      <div v-if="notebooks.length" class="space-y-4">
        <div v-for="book in notebooks" :key="book.bookId" 
             class="glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div class="p-4">
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-4 cursor-pointer" @click="toggleBook(book.bookId)">
                <img :src="book.book?.cover" class="w-14 h-20 object-cover rounded-lg shadow-md" />
                <div>
                  <h3 class="font-semibold text-gray-800">{{ book.book?.title }}</h3>
                  <p class="text-sm text-gray-500">{{ book.book?.author }}</p>
                  <div class="flex gap-3 mt-1">
                    <span class="text-xs text-gray-400">📝 {{ book.totalNotes }} 笔记</span>
                    <span class="text-xs text-gray-400">✏️ {{ book.noteCount }} 划线</span>
                    <span class="text-xs text-gray-400">💬 {{ book.reviewCount }} 想法</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button 
                  @click="goToBookDetail(book.bookId)" 
                  class="px-3 py-1.5 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  查看详情
                </button>
                <button @click="toggleBook(book.bookId)" class="text-gray-400 transition-transform" :class="{ 'rotate-180': expandedBookId === book.bookId }">
                  ▼
                </button>
              </div>
            </div>
            
            <!-- 阅读进度条（如果有） -->
            <div v-if="book.readingProgress > 0" class="mt-3">
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>阅读进度</span>
                <span>{{ getProgressText(book.readingProgress) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5">
                <div class="bg-primary-500 h-1.5 rounded-full" :style="{ width: book.readingProgress + '%' }"></div>
              </div>
            </div>
          </div>
          
          <!-- 展开的笔记内容 -->
          <div v-if="expandedBookId === book.bookId" class="border-t border-white/20 bg-white/30">
            <div v-if="loadingNotes[book.bookId]" class="p-8 text-center">
              <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent"></div>
              <p class="text-sm text-gray-500 mt-2">加载笔记中...</p>
            </div>
            <div v-else-if="bookNotes[book.bookId]" class="divide-y divide-white/20">
              <div v-for="chapter in bookNotes[book.bookId].chapters" :key="chapter.chapterUid" class="p-4">
                <h4 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <span class="w-1 h-4 bg-primary-500 rounded-full"></span>
                  {{ chapter.title }}
                </h4>
                <div class="space-y-3 ml-2">
                  <div v-for="note in chapter.notes" :key="note.bookmarkId || note.reviewId" 
                       class="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div v-if="note.type === 'underline'" class="border-l-4 border-amber-400 pl-3">
                      <div class="flex items-start justify-between">
                        <p class="text-gray-700 italic leading-relaxed">“{{ note.markText }}”</p>
                        <a v-if="note.deepLink" :href="note.deepLink" class="text-xs text-gray-400 hover:text-primary-600 ml-2 flex-shrink-0">📍 跳转</a>
                      </div>
                      <p class="text-xs text-gray-400 mt-2">{{ note.createTime }}</p>
                    </div>
                    <div v-else class="border-l-4 border-primary-400 pl-3">
                      <div class="flex items-start justify-between">
                        <p class="text-gray-700 leading-relaxed">{{ note.content }}</p>
                        <a v-if="note.deepLink" :href="note.deepLink" class="text-xs text-gray-400 hover:text-primary-600 ml-2 flex-shrink-0">📍 跳转</a>
                      </div>
                      <div class="flex items-center gap-2 mt-2">
                        <span v-if="note.chapterName" class="text-xs text-gray-400">📍 {{ note.chapterName }}</span>
                        <span class="text-xs text-gray-400">{{ note.createTime }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="glass rounded-2xl p-12 text-center text-gray-400">
        <div class="text-5xl mb-3">📭</div>
        <p>暂无笔记，快去读书划线吧！</p>
        <router-link to="/shelf" class="inline-block mt-4 text-primary-600 text-sm">去书架逛逛 →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getNotebooks, getAllNotes } from '../api/weread.js'

const router = useRouter()

const loading = ref(true)
const notebooks = ref([])
const expandedBookId = ref(null)
const bookNotes = ref({})
const loadingNotes = ref({})

const totalBooks = computed(() => notebooks.value.length)
const totalNotes = computed(() => notebooks.value.reduce((sum, b) => sum + (b.totalNotes || 0), 0))
const totalUnderlines = computed(() => notebooks.value.reduce((sum, b) => sum + (b.noteCount || 0), 0))
const totalReviews = computed(() => notebooks.value.reduce((sum, b) => sum + (b.reviewCount || 0), 0))

const getProgressText = (progress) => {
  if (!progress) return '未开始'
  if (progress === 100) return '已读完'
  return `${progress}%`
}

const fetchNotebooks = async () => {
  loading.value = true
  try {
    const data = await getNotebooks(20, null, true)
    notebooks.value = data.books || []
  } catch (error) {
    console.error('获取笔记本列表失败:', error)
  } finally {
    loading.value = false
  }
}

const toggleBook = async (bookId) => {
  if (expandedBookId.value === bookId) {
    expandedBookId.value = null
    return
  }
  expandedBookId.value = bookId
  if (!bookNotes.value[bookId]) {
    loadingNotes.value[bookId] = true
    try {
      const notes = await getAllNotes(bookId)
      bookNotes.value[bookId] = notes
    } catch (error) {
      console.error('获取笔记失败:', error)
    } finally {
      loadingNotes.value[bookId] = false
    }
  }
}

// 跳转到书籍详情页
const goToBookDetail = (bookId) => {
  router.push(`/book/${bookId}`)
}

onMounted(fetchNotebooks)
</script>