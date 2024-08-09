import { createRouter, createWebHistory } from 'vue-router'
import ErrorPage from '@/views/error.view.vue'
import MusicView from "@/views/pages/music.view.vue"

export const routes = [
  {
    path: '/',
    full_name: 'Главная',
    icon: 'compact-disc',
    name: 'home',
    shown: true,
    component: MusicView
  },
  {
    path: '/:catchAll(.*)',
    name: 'error_page',
    props: {
      error: 123
    },
    shown: false,
    component: ErrorPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
