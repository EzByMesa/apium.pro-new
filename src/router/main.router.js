import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/pages/home.view.vue'
import FourOFour from '@/views/errors/404.view.vue'
import MusicView from "@/views/pages/music.view.vue";

export const routes = [
  {
    path: '/',
    full_name: 'Главная',
    icon: 'home',
    name: 'home',
    shown: true,
    component: HomeView
  },
  {
    path: '/music',
    full_name: 'Музыка',
    icon: 'compact-disc',
    name: 'music',
    shown: true,
    component: MusicView
  },
  {
    path: '/:catchAll(.*)',
    name: 'error_404',
    shown: false,
    component: FourOFour
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
