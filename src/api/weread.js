// src/api/weread.js
import axios from 'axios'

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 30000
})

// 响应拦截器
request.interceptors.response.use(
  response => {
    if (response.data.success) {
      return response.data.data
    } else {
      return Promise.reject(new Error(response.data.error || '请求失败'))
    }
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// ========== 书架模块 ==========
export const getShelf = () => request.post('/shelf/sync')

// ========== Book 模块 ==========
export const getBookInfo = (bookId) => request.post('/book/info', { bookId })
export const getBookChapters = (bookId) => request.post('/book/chapterinfo', { bookId })
export const getBookProgress = (bookId) => request.post('/book/getprogress', { bookId })

// ========== 笔记模块 ==========
export const getNotebooks = (count = 20, lastSort = null, fetchAll = false) => 
  request.post('/notes/notebooks', { count, lastSort, fetchAll })

export const getAllNotes = (bookId) => request.post('/notes/all', { bookId })

export const getMyReviews = (bookId, synckey = 0, count = 20) => 
  request.post('/notes/my-reviews', { bookId, synckey, count })

export const getBookmarkList = (bookId) => request.post('/notes/bookmarklist', { bookId })

// 热门划线 & 划线热度 & 划线想法
export const getBestBookmarks = (bookId, chapterUid = 0, synckey = 0) =>
  request.post('/notes/best-bookmarks', { bookId, chapterUid, synckey })

export const getChapterUnderlines = (bookId, chapterUid, synckey = 0) =>
  request.post('/notes/underlines', { bookId, chapterUid, synckey })

export const getReadReviews = (bookId, chapterUid, reviews) =>
  request.post('/notes/read-reviews', { bookId, chapterUid, reviews })

// ========== 阅读统计模块 ==========
export const getReadDataDetail = (mode = 'monthly', baseTime = 0) => 
  request.post('/readdata/detail', { mode, baseTime })

export const getReadDataSummary = (mode = 'monthly', baseTime = 0) => 
  request.post('/readdata/summary', { mode, baseTime })

// ========== 搜索模块 ==========
export const searchBooks = (keyword, scope = 10, maxIdx = 0, count = null) => 
  request.post('/search', { keyword, scope, maxIdx, count })

// ========== 推荐模块 ==========
export const getRecommend = (count = 12, maxIdx = 0) => 
  request.post('/discover/recommend', { count, maxIdx })

// src/api/weread.js

// 修改相似推荐接口，只传递有值的参数
export const getSimilarBooks = (bookId, count = 12, maxIdx = 0, sessionId = null) => {
  const params = { bookId, count, maxIdx }
  // 只有当 sessionId 有值且为字符串时才传递
  if (sessionId && typeof sessionId === 'string') {
    params.sessionId = sessionId
  }
  return request.post('/discover/similar', params)
}

// ========== 用户概况 ==========
export const getProfileOverview = () => request.post('/profile/overview')
export const getProfileProgress = (bookId) => request.post('/profile/progress', { bookId })

// ========== 点评模块 ==========
export const getBookReviews = (bookId, reviewListType = 0, count = 20, maxIdx = 0, synckey = 0) =>
  request.post('/review/list', { bookId, reviewListType, count, maxIdx, synckey })

export const getSingleReview = (reviewId, options = {}) => {
  const { commentsCount = 10, commentsDirection = 0, likesCount = 10, likesDirection = 0, synckey = 0 } = options
  return request.post('/review/single', { reviewId, commentsCount, commentsDirection, likesCount, likesDirection, synckey })
}