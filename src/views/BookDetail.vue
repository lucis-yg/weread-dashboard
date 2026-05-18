<!-- src/views/BookDetail.vue -->
<template>
    <div class="min-h-screen bg-gray-50">
        <!-- 顶部导航 -->
        <div class="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
            <router-link to="/" class="text-gray-500 hover:text-gray-700 transition-colors">
                <span class="text-2xl">←</span>
            </router-link>
            <h1 class="text-base md:text-lg font-semibold text-gray-800 truncate flex-1">{{ bookInfo?.title || '加载中...'
                }}</h1>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="p-4 md:p-6 space-y-4 md:space-y-6">
            <div class="skeleton h-40 md:h-48 rounded-2xl"></div>
            <div class="skeleton h-28 md:h-32 rounded-2xl"></div>
            <div class="skeleton h-48 md:h-64 rounded-2xl"></div>
        </div>

        <div v-else-if="bookInfo" class="pb-24 md:pb-32">
            <!-- 书籍头部卡片 -->
            <div class="bg-white p-4 md:p-6 flex gap-4 md:gap-6 border-b border-gray-100 shadow-sm">
                <img :src="bookInfo.cover" class="w-24 md:w-32 object-cover rounded-xl shadow-md flex-shrink-0"
                    :class="bookInfo.cover ? 'aspect-[2/3]' : 'h-36 md:h-48'" />
                <div class="flex-1 min-w-0">
                    <h2 class="text-lg md:text-xl font-bold text-gray-800 break-words">{{ bookInfo.title }}</h2>
                    <p class="text-sm text-gray-500 mt-1">{{ bookInfo.author || '未知作者' }}</p>

                    <!-- 评分区域 -->
                    <div class="flex items-center gap-3 mt-3 flex-wrap">
                        <div class="flex items-baseline gap-1">
                            <span class="text-2xl md:text-3xl font-bold text-amber-500">{{ (bookInfo.rating /
                                10).toFixed(1) }}</span>
                            <span class="text-sm text-gray-400">分</span>
                        </div>
                        <span class="text-sm text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full">{{
                            bookInfo.ratingDetail?.title || '暂无评价' }}</span>
                    </div>

                    <!-- 阅读进度条（如果有） -->
                    <div v-if="progress && progress.progress > 0" class="mt-4">
                        <div class="flex justify-between text-xs text-gray-500 mb-1">
                            <span>阅读进度</span>
                            <span>{{ progress.progressDisplay }}</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-1.5">
                            <div class="bg-primary-500 h-1.5 rounded-full transition-all"
                                :style="{ width: progress.progress + '%' }"></div>
                        </div>
                    </div>

                    <!-- 按钮组 -->
                    <div class="flex gap-3 mt-4 flex-wrap">
                        <a :href="bookInfo.deepLink" target="_blank"
                            class="inline-flex items-center gap-1 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors">
                            📱 打开阅读
                        </a>
                        <button v-if="progress && progress.progress > 0 && progress.progress < 100"
                            @click="scrollToProgress"
                            class="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                            📖 继续阅读
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tab 导航栏 - 响应式滚动 -->
            <!-- Tab 导航栏 - 修复抖动 -->
            <div
                class="sticky top-[57px] z-10 bg-white border-b border-gray-100 shadow-sm overflow-x-auto scrollbar-hide">
                <div class="flex min-w-max md:min-w-0 md:justify-around px-4">
                    <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" :class="[
                        'px-3 md:px-5 py-3 text-sm md:text-base font-medium transition-colors whitespace-nowrap',
                        'border-b-2 border-transparent',  // 始终保留 2px 透明边框，防止抖动
                        activeTab === tab.key
                            ? 'text-primary-500 border-primary-500'
                            : 'text-gray-500 hover:text-gray-700'
                    ]">
                        {{ tab.label }}
                    </button>
                </div>
            </div>

            <!-- Tab 内容区域 - 添加 min-h 和 transition 防止抖动 -->
            <div class="p-4 md:p-6 max-w-4xl mx-auto">
                <div class="transition-all duration-200">

                    <!-- ========== 简介 Tab ========== -->
                    <div v-if="activeTab === 'intro'" class="space-y-4 md:space-y-6">
                        <!-- 内容简介 -->
                        <div class="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                            <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span class="text-xl">📖</span> 内容简介
                            </h3>
                            <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{{ bookInfo.intro ||
                                '暂无简介' }}</p>
                        </div>

                        <!-- 评分详情 -->
                        <div class="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                            <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <span class="text-xl">📊</span> 评分详情
                            </h3>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div><span class="text-gray-500">推荐值：</span><span class="font-medium">{{ bookInfo.rating
                                        || '暂无' }}</span></div>
                                <div><span class="text-gray-500">评价标签：</span><span class="font-medium">{{
                                        bookInfo.ratingDetail?.title || '无' }}</span></div>
                                <div><span class="text-gray-500">好评：</span>{{ bookInfo.ratingDetail?.good || 0 }}</div>
                                <div><span class="text-gray-500">一般：</span>{{ bookInfo.ratingDetail?.fair || 0 }}</div>
                                <div><span class="text-gray-500">差评：</span>{{ bookInfo.ratingDetail?.poor || 0 }}</div>
                                <div><span class="text-gray-500">深度用户：</span>{{ bookInfo.ratingDetail?.deepV || 0 }}
                                </div>
                                <div><span class="text-gray-500">近期评价：</span>{{ bookInfo.ratingDetail?.recent || 0 }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ========== 阅读进度 Tab ========== -->
                    <div v-if="activeTab === 'progress'">
                        <div class="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                            <div v-if="progress" class="space-y-5">
                                <div class="flex justify-between items-center">
                                    <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                                        <span class="text-xl">📖</span> 阅读进度
                                    </h3>
                                    <a :href="progress.deepLink" target="_blank"
                                        class="text-sm text-primary-500 hover:underline">继续阅读 →</a>
                                </div>

                                <div>
                                    <div class="flex justify-between text-sm mb-2">
                                        <span class="text-gray-600">{{ progress.progressDisplay }}</span>
                                        <span class="text-gray-500">已读 {{ progress.readTime?.formatted || '0分钟'
                                            }}</span>
                                    </div>
                                    <div class="w-full bg-gray-100 rounded-full h-2.5">
                                        <div class="bg-primary-500 h-2.5 rounded-full transition-all"
                                            :style="{ width: progress.progress + '%' }"></div>
                                    </div>
                                </div>

                                <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-500">上次阅读</span>
                                        <span class="text-gray-700">{{ progress.lastReadTime || '未知' }}</span>
                                    </div>
                                    <div v-if="progress.currentPosition" class="flex justify-between">
                                        <span class="text-gray-500">当前位置</span>
                                        <span class="text-gray-700">第 {{ progress.currentPosition.chapterUid }} 章</span>
                                    </div>
                                    <div v-if="progress.isStarted && !progress.isFinished" class="flex justify-between">
                                        <span class="text-gray-500">阅读状态</span>
                                        <span class="text-blue-500">阅读中</span>
                                    </div>
                                    <div v-if="progress.isFinished" class="flex justify-between">
                                        <span class="text-gray-500">阅读状态</span>
                                        <span class="text-green-500">🎉 已读完</span>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-center text-gray-400 py-12">
                                <div class="text-5xl mb-3">📭</div>
                                <p>暂无阅读记录</p>
                                <p class="text-xs mt-2">开始阅读后，这里会显示你的阅读进度</p>
                            </div>
                        </div>
                    </div>

                    <!-- ========== 章节目录 Tab ========== -->
                    <div v-if="activeTab === 'chapters'">
                        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div
                                class="p-4 md:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                                    <span class="text-xl">📑</span> 章节目录
                                </h3>
                                <span class="text-xs md:text-sm text-gray-400 bg-white px-2 py-1 rounded-full">共 {{
                                    chapters.length }} 章</span>
                            </div>

                            <div v-if="chaptersLoading" class="p-4 md:p-5 space-y-3">
                                <div v-for="i in 12" :key="i" class="skeleton h-10 w-full rounded-lg"></div>
                            </div>

                            <div v-else-if="chapters.length" class="divide-y divide-gray-50">
                                <div v-for="ch in chapters" :key="ch.chapterUid"
                                    class="p-3 md:p-4 hover:bg-gray-50 transition-colors"
                                    :style="{ paddingLeft: ch.level === 2 ? '32px' : ch.level === 3 ? '44px' : '16px' }">
                                    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                        <span class="text-sm md:text-base text-gray-800">{{ ch.title }}</span>
                                        <div class="flex flex-wrap gap-2 text-xs">
                                            <span v-if="ch.wordCount" class="text-gray-400">{{ ch.wordCount }}字</span>
                                            <span v-if="ch.price > 0"
                                                class="text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">付费</span>
                                            <span v-else-if="ch.price === 0"
                                                class="text-green-500 bg-green-50 px-2 py-0.5 rounded-full">免费</span>
                                            <span v-if="ch.isMPChapter"
                                                class="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">公众号</span>
                                            <span v-if="ch.isPaid"
                                                class="text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">已购</span>
                                        </div>
                                    </div>
                                    <div v-if="ch.anchors && ch.anchors.length" class="ml-4 md:ml-6 mt-2 space-y-1">
                                        <div v-for="anchor in ch.anchors" :key="anchor.anchorUid"
                                            class="text-xs text-gray-500 py-1">
                                            {{ anchor.title }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="text-center text-gray-400 py-12">
                                <div class="text-4xl mb-3">📭</div>
                                <p>暂无目录信息</p>
                            </div>
                        </div>
                    </div>

                    <!-- ========== 热门划线 Tab ========== -->
                    <div v-if="activeTab === 'highlights'">
                        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div class="p-4 md:p-5 border-b border-gray-100 bg-gray-50/50">
                                <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                                    <span class="text-xl">🔥</span> 热门划线
                                </h3>
                                <p class="text-xs text-gray-400 mt-1">其他读者标记最多的内容</p>
                            </div>

                            <div v-if="bestBookmarksLoading" class="p-4 md:p-5 space-y-4">
                                <div v-for="i in 4" :key="i" class="skeleton h-24 w-full rounded-xl"></div>
                            </div>

                            <div v-else-if="bestBookmarks.length" class="divide-y divide-gray-100">
                                <div v-for="item in bestBookmarks" :key="item.bookmarkId" class="p-4 md:p-5">
                                    <p class="text-gray-700 leading-relaxed text-sm md:text-base">“{{ item.markText }}”
                                    </p>
                                    <div class="flex justify-between items-center mt-3">
                                        <span class="text-xs text-amber-500">🔥 {{ item.totalCount }} 人划线</span>
                                        <button @click="toggleUnderlineIdeas(item)"
                                            class="text-xs text-primary-500 hover:underline">
                                            {{ item.showIdeas ? '收起想法' : '查看想法' }}
                                        </button>
                                    </div>

                                    <div v-if="item.showIdeas && item.ideas?.length"
                                        class="mt-3 pl-3 border-l-2 border-amber-200 space-y-2">
                                        <div v-for="idea in item.ideas" :key="idea.reviewId"
                                            class="text-sm bg-gray-50 p-3 rounded-lg">
                                            <p class="text-gray-600">{{ idea.content }}</p>
                                            <p class="text-xs text-gray-400 mt-2 flex items-center gap-2">
                                                <span>{{ idea.author?.name || '匿名用户' }}</span>
                                                <span>·</span>
                                                <span>{{ idea.createTime }}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="text-center text-gray-400 py-12">
                                <div class="text-4xl mb-3">📭</div>
                                <p>暂无热门划线</p>
                                <p class="text-xs mt-1">还没有人标记划线</p>
                            </div>
                        </div>
                    </div>

                    <!-- ========== 书友点评 Tab ========== -->
                    <div v-if="activeTab === 'reviews'">
                        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div
                                class="p-4 md:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                                    <span class="text-xl">💬</span> 书友点评
                                </h3>
                                <span class="text-xs md:text-sm text-gray-400 bg-white px-2 py-1 rounded-full">共 {{
                                    reviewsTotal }} 条</span>
                            </div>

                            <div v-if="reviewsLoading" class="p-4 md:p-5 space-y-4">
                                <div v-for="i in 3" :key="i" class="skeleton h-28 w-full rounded-xl"></div>
                            </div>

                            <div v-else-if="reviews.length" class="divide-y divide-gray-100">
                                <div v-for="rev in reviews" :key="rev.reviewId" class="p-4 md:p-5">
                                    <div class="flex items-center gap-3 mb-2 flex-wrap">
                                        <span class="font-medium text-sm text-gray-800">{{ rev.author?.name || '匿名用户'
                                            }}</span>
                                        <div class="flex items-center gap-1">
                                            <span class="text-xs text-amber-500">{{ rev.ratingStars }}</span>
                                            <span class="text-xs text-gray-400">({{ rev.rating }}分)</span>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-600 leading-relaxed">{{ rev.content }}</p>
                                    <p class="text-xs text-gray-400 mt-2">{{ rev.createTime }}</p>
                                </div>
                            </div>

                            <div v-else class="text-center text-gray-400 py-12">
                                <div class="text-4xl mb-3">📭</div>
                                <p>暂无点评</p>
                                <p class="text-xs mt-1">成为第一个点评的人吧</p>
                            </div>
                        </div>
                    </div>

                    <!-- ========== 相似推荐 Tab ========== -->
                    <div v-if="activeTab === 'similar'">
                        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div class="p-4 md:p-5 border-b border-gray-100 bg-gray-50/50">
                                <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                                    <span class="text-xl">🔍</span> 相似推荐
                                </h3>
                                <p class="text-xs text-gray-400 mt-1">根据这本书推荐的相似作品</p>
                            </div>

                            <div v-if="similarLoading" class="p-4 md:p-5">
                                <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
                                    <div v-for="i in 6" :key="i" class="skeleton h-32 md:h-40 rounded-xl"></div>
                                </div>
                            </div>

                            <div v-else-if="similarBooks.length" class="p-4 md:p-5">
                                <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
                                    <div v-for="book in similarBooks" :key="book.bookId"
                                        class="cursor-pointer group transition-transform hover:-translate-y-1"
                                        @click="goToBookDetail(book.bookId)">
                                        <img :src="book.cover"
                                            class="w-full aspect-[2/3] object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow" />
                                        <p class="text-xs truncate mt-2 text-center text-gray-700">{{ book.title }}</p>
                                        <p class="text-xs text-gray-400 text-center truncate">{{ book.author }}</p>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="text-center text-gray-400 py-12">
                                <div class="text-4xl mb-3">📭</div>
                                <p>暂无相似推荐</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'  // 添加 nextTick
import { useRoute, useRouter } from 'vue-router'
import {
  getBookInfo,
  getBookChapters,
  getBookProgress,
  getBestBookmarks,
  getReadReviews,
  getBookReviews,
  getSimilarBooks
} from '../api/weread.js'

const route = useRoute()
const router = useRouter()
const bookId = ref(route.params.id)

// 滚动到顶部的函数
const scrollToTop = () => {
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

// 数据状态
const loading = ref(true)
const bookInfo = ref(null)
const progress = ref(null)
const chapters = ref([])
const chaptersLoading = ref(false)
const bestBookmarks = ref([])
const bestBookmarksLoading = ref(false)
const reviews = ref([])
const reviewsLoading = ref(false)
const reviewsTotal = ref(0)
const similarBooks = ref([])
const similarLoading = ref(false)

// Tab 配置
const tabs = [
  { key: 'intro', label: '简介' },
  { key: 'progress', label: '阅读进度' },
  { key: 'chapters', label: '目录' },
  { key: 'highlights', label: '热门划线' },
  { key: 'reviews', label: '书友点评' },
  { key: 'similar', label: '相似推荐' }
]
const activeTab = ref('intro')

// 滚动到阅读进度
const scrollToProgress = () => {
  activeTab.value = 'progress'
  scrollToTop()
}

// 重置所有数据
const resetData = () => {
  bookInfo.value = null
  progress.value = null
  chapters.value = []
  chaptersLoading.value = false
  bestBookmarks.value = []
  bestBookmarksLoading.value = false
  reviews.value = []
  reviewsLoading.value = false
  reviewsTotal.value = 0
  similarBooks.value = []
  similarLoading.value = false
  activeTab.value = 'intro'
}

// 加载基础信息
const loadBasicInfo = async () => {
  try {
    const [info, prog] = await Promise.all([
      getBookInfo(bookId.value),
      getBookProgress(bookId.value)
    ])
    bookInfo.value = info
    progress.value = prog
  } catch (err) {
    console.error('加载基础信息失败:', err)
  }
}

// 加载章节目录
const loadChapters = async () => {
  if (chapters.value.length > 0) return
  chaptersLoading.value = true
  try {
    const data = await getBookChapters(bookId.value)
    chapters.value = data.chapters || []
  } catch (err) {
    console.error('加载目录失败:', err)
  } finally {
    chaptersLoading.value = false
  }
}

// 加载热门划线
const loadBestBookmarks = async () => {
  bestBookmarksLoading.value = true
  try {
    const data = await getBestBookmarks(bookId.value, 0, 0)
    bestBookmarks.value = (data.items || []).map(item => ({ ...item, showIdeas: false, ideas: [] }))
  } catch (err) {
    console.error('加载热门划线失败:', err)
  } finally {
    bestBookmarksLoading.value = false
  }
}

// 加载划线下的想法
const toggleUnderlineIdeas = async (item) => {
  if (item.showIdeas) {
    item.showIdeas = false
    return
  }
  if (item.ideas.length) {
    item.showIdeas = true
    return
  }
  try {
    const reviewsParam = [{ range: item.range, maxIdx: 0, count: 10, synckey: 0 }]
    const data = await getReadReviews(bookId.value, item.chapterUid, reviewsParam)
    item.ideas = data.reviews?.[0]?.pageReviews || []
    item.showIdeas = true
  } catch (err) {
    console.error('加载想法失败:', err)
  }
}

// 加载书友点评
const loadReviews = async () => {
  reviewsLoading.value = true
  try {
    const data = await getBookReviews(bookId.value, 0, 20, 0, 0)
    reviews.value = data.reviews || []
    reviewsTotal.value = data.reviewsCnt || 0
  } catch (err) {
    console.error('加载点评失败:', err)
  } finally {
    reviewsLoading.value = false
  }
}

// 加载相似推荐
const loadSimilarBooks = async () => {
  similarLoading.value = true
  try {
    const data = await getSimilarBooks(bookId.value, 12, 0)
    similarBooks.value = data.books || []
  } catch (err) {
    console.error('加载相似推荐失败:', err)
  } finally {
    similarLoading.value = false
  }
}

// 跳转到其他书籍详情
const goToBookDetail = (newBookId) => {
  router.push(`/book/${newBookId}`)
}

// 加载所有数据（用于初始化和路由变化时）
const loadAllData = async () => {
  loading.value = true
  resetData()
  await loadBasicInfo()
  loading.value = false
  scrollToTop()  // 数据加载完成后滚动到顶部
  
  // 如果当前 Tab 需要懒加载数据，则触发加载
  if (activeTab.value === 'chapters') loadChapters()
  if (activeTab.value === 'highlights') loadBestBookmarks()
  if (activeTab.value === 'reviews') loadReviews()
  if (activeTab.value === 'similar') loadSimilarBooks()
}

// 监听 Tab 切换，懒加载数据并滚动到顶部
watch(activeTab, (newTab) => {
  scrollToTop()  // Tab 切换时滚动到顶部
  if (newTab === 'chapters' && chapters.value.length === 0) loadChapters()
  if (newTab === 'highlights' && bestBookmarks.value.length === 0) loadBestBookmarks()
  if (newTab === 'reviews' && reviews.value.length === 0) loadReviews()
  if (newTab === 'similar' && similarBooks.value.length === 0) loadSimilarBooks()
})

// 监听路由参数变化，重新加载数据
watch(() => route.params.id, (newId) => {
  if (newId) {
    bookId.value = newId
    loadAllData()
  }
})

onMounted(() => {
  loadAllData()
})
</script>


<style scoped>
/* 隐藏滚动条但保留滚动功能 */
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
    border-radius: 12px;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

/* 防止 Tab 切换时的抖动 */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
}
</style>