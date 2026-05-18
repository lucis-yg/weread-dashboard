// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Shelf from './views/Shelf.vue'
import Notes from './views/Notes.vue'
import Stats from './views/Stats.vue'
import BookDetail from './views/BookDetail.vue'

const routes = [
  { path: '/', name: 'dashboard', component: Dashboard },
  { path: '/shelf', name: 'shelf', component: Shelf },
  { path: '/notes', name: 'notes', component: Notes },
  { path: '/stats', name: 'stats', component: Stats },
  { path: '/book/:id', name: 'bookDetail', component: BookDetail }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router