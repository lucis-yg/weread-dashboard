<!-- src/views/Stats.vue -->
<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        📊 阅读统计
      </h1>
      <p class="text-sm text-gray-500 mt-1">用数据见证成长</p>
    </div>
    
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
      <button v-for="mode in modes" :key="mode.key" 
              @click="changeMode(mode.key)"
              :class="['px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap', 
                       currentMode === mode.key ? 'bg-primary-600 text-white shadow-lg' : 'glass text-gray-600']">
        {{ mode.label }}
      </button>
    </div>
    
    <div v-if="loading" class="space-y-6">
      <div class="skeleton h-40 rounded-2xl"></div>
      <div class="skeleton h-60 rounded-2xl"></div>
    </div>
    
    <div v-else class="space-y-5">
      <!-- 摘要卡片（调用 summary 接口） -->
      <div class="glass rounded-2xl p-4 bg-gradient-to-r from-primary-50 to-white">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-gray-800">📋 快速摘要</h3>
          <button @click="fetchSummary" class="text-xs text-primary-600">刷新</button>
        </div>
        <div v-if="summaryData" class="mt-2 grid grid-cols-2 gap-3 text-sm">
          <div>阅读天数：<span class="font-bold">{{ summaryData.readDays || 0 }}</span></div>
          <div>总时长：<span class="font-bold">{{ summaryData.totalReadTimeFormatted || '0' }}</span></div>
          <div>日均：<span class="font-bold">{{ summaryData.dayAverageReadTimeFormatted || '0' }}</span></div>
          <div>偏好：<span class="font-bold">{{ summaryData.preferCategoryWord || '-' }}</span></div>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="glass rounded-2xl p-5 text-center">
          <div class="text-3xl mb-1">📅</div>
          <div class="text-3xl font-bold text-primary-600">{{ statsData.readDays || 0 }}</div>
          <div class="text-sm text-gray-500">阅读天数</div>
        </div>
        <div class="glass rounded-2xl p-5 text-center">
          <div class="text-3xl mb-1">⏱️</div>
          <div class="text-3xl font-bold text-primary-600">{{ statsData.totalReadTimeFormatted || '0' }}</div>
          <div class="text-sm text-gray-500">阅读时长</div>
        </div>
      </div>
      
      <div v-if="statsData.compare !== undefined" class="glass rounded-2xl p-4 flex items-center justify-between">
        <span class="text-gray-600">较上期</span>
        <div class="flex items-center gap-2">
          <span :class="statsData.compare > 0 ? 'text-green-500' : 'text-red-500'" class="font-medium">
            {{ statsData.compare > 0 ? '↑' : '↓' }} {{ Math.abs(statsData.compare * 100).toFixed(0) }}%
          </span>
          <span class="text-gray-400 text-sm">{{ statsData.compare > 0 ? '进步了' : '退步了' }}</span>
        </div>
      </div>
      
      <div class="glass rounded-2xl p-5">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📈</span> 阅读分布
        </h3>
        <div v-if="timeDistribution.length" class="space-y-2">
          <div v-for="item in timeDistribution" :key="item.hour" class="flex items-center gap-3 text-sm">
            <span class="w-20 text-gray-500">{{ item.label }}</span>
            <div class="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500 flex items-center justify-end px-2 text-xs text-white" 
                   :style="{ width: item.percent + '%' }">
                <span v-if="item.percent > 15">{{ item.value }}</span>
              </div>
            </div>
            <span class="w-12 text-right text-gray-500">{{ item.value }}</span>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 py-6">暂无时段数据</div>
      </div>
      
      <div class="glass rounded-2xl p-5">
        <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🏆</span> 读书排行榜
        </h3>
        <div v-if="statsData.readLongest?.length" class="space-y-3">
          <div v-for="(book, index) in statsData.readLongest.slice(0, 5)" :key="index" 
               class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                 :class="{ 'bg-amber-100 text-amber-600': index === 0, 'bg-gray-100 text-gray-500': index !== 0 }">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <div class="font-medium text-gray-800">{{ book.title }}</div>
              <div class="text-xs text-gray-400">{{ book.author || '未知作者' }}</div>
            </div>
            <div class="text-sm text-primary-600">{{ book.readTimeFormatted }}</div>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 py-6">暂无阅读记录</div>
      </div>
      
      <div class="glass rounded-2xl p-5">
        <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>🎯</span> 阅读偏好
        </h3>
        <div class="flex flex-wrap gap-2">
          <div v-if="statsData.preferCategoryWord" class="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm">
            📚 {{ statsData.preferCategoryWord }}
          </div>
          <div v-if="statsData.preferTimeWord" class="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-sm">
            ⏰ {{ statsData.preferTimeWord }}
          </div>
        </div>
      </div>
      
      <div v-if="statsData.yearReport?.length" class="glass rounded-2xl p-5">
        <h3 class="font-semibold text-gray-800 mb-3">📅 年度报告</h3>
        <div class="flex gap-3">
          <div v-for="report in statsData.yearReport" :key="report.year" 
               class="flex-1 text-center p-3 bg-white rounded-xl">
            <div class="text-xl font-bold text-primary-600">{{ report.year }}</div>
            <div class="text-xs text-gray-500">已生成</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getReadDataDetail, getReadDataSummary } from '../api/weread.js'

const loading = ref(true)
const statsData = ref({})
const summaryData = ref(null)
const currentMode = ref('monthly')

const modes = [
  { key: 'weekly', label: '本周' },
  { key: 'monthly', label: '本月' },
  { key: 'annually', label: '本年' },
  { key: 'overall', label: '总计' },
]

const timeDistribution = computed(() => {
  const times = statsData.value.preferTime || []
  if (!times.length) return []
  const maxValue = Math.max(...times.map(t => {
    const match = t.formatted?.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }))
  return times.map(t => {
    const match = t.formatted?.match(/(\d+)/)
    const value = match ? parseInt(match[1]) : 0
    const percent = maxValue > 0 ? (value / maxValue) * 100 : 0
    let label = ''
    if (t.hour >= 6 && t.hour < 12) label = '🌅 上午'
    else if (t.hour >= 12 && t.hour < 18) label = '☀️ 下午'
    else if (t.hour >= 18 && t.hour < 22) label = '🌙 晚上'
    else label = '🌃 深夜'
    return { hour: t.hour, label, value, percent, raw: t.formatted }
  })
})

const fetchSummary = async () => {
  try {
    const data = await getReadDataSummary(currentMode.value, 0)
    summaryData.value = data
  } catch (err) {
    console.error('获取摘要失败:', err)
  }
}

const changeMode = async (mode) => {
  currentMode.value = mode
  loading.value = true
  try {
    const [detail, summary] = await Promise.all([
      getReadDataDetail(mode, 0),
      getReadDataSummary(mode, 0)
    ])
    statsData.value = detail
    summaryData.value = summary
  } catch (error) {
    console.error('获取统计失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const [detail, summary] = await Promise.all([
      getReadDataDetail('monthly', 0),
      getReadDataSummary('monthly', 0)
    ])
    statsData.value = detail
    summaryData.value = summary
  } catch (error) {
    console.error('获取统计失败:', error)
  } finally {
    loading.value = false
  }
})
</script>