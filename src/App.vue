<!-- src/App.vue -->
<template>
  <div class="min-h-screen" style="background: var(--gradient-bg)">
    <!-- 顶部状态栏（沉浸式） -->
    <div class="fixed top-0 left-0 right-0 z-20 px-4 py-3 glass border-b border-white/20">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
            <span class="text-white text-sm">📚</span>
          </div>
          <span class="font-semibold text-gray-800">WeRead<span class="text-primary-600"> Dashboard</span></span>
        </div>
        <div class="text-xs text-gray-400 hidden sm:block">
          你的智能阅读伙伴
        </div>
      </div>
    </div>
    
    <!-- 底部导航栏（现代化设计） -->
    <nav class="fixed bottom-4 left-4 right-4 z-20 glass rounded-2xl shadow-glass border border-white/30 mx-auto max-w-md md:max-w-2xl">
      <div class="flex justify-around py-2">
        <router-link to="/" class="nav-item" active-class="nav-item-active">
          <div class="flex flex-col items-center gap-0.5">
            <span class="text-xl">🏠</span>
            <span class="text-xs">首页</span>
          </div>
        </router-link>
        <router-link to="/shelf" class="nav-item" active-class="nav-item-active">
          <div class="flex flex-col items-center gap-0.5">
            <span class="text-xl">📚</span>
            <span class="text-xs">书架</span>
          </div>
        </router-link>
        <router-link to="/notes" class="nav-item" active-class="nav-item-active">
          <div class="flex flex-col items-center gap-0.5">
            <span class="text-xl">✏️</span>
            <span class="text-xs">笔记</span>
          </div>
        </router-link>
        <router-link to="/stats" class="nav-item" active-class="nav-item-active">
          <div class="flex flex-col items-center gap-0.5">
            <span class="text-xl">📊</span>
            <span class="text-xs">统计</span>
          </div>
        </router-link>
      </div>
    </nav>
    
    <!-- 主内容区域 -->
    <main class="pt-16 pb-24 px-4 md:px-6">
      <router-view />
    </main>
  </div>
</template>

<style>
/* ✅ 关键：使用 @reference 导入 Tailwind，以获得所有工具类的定义 */
@reference "./assets/main.css"; /* 指向您的主 CSS 文件 */

.nav-item {
  @apply flex-1 py-2 rounded-xl transition-all duration-200 text-gray-500;
}
.nav-item-active {
  @apply text-primary-600 bg-primary-50/80 shadow-sm;
}
</style>