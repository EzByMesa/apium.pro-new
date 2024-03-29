import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/pages/home.view.vue'
import FourOFour from '@/views/errors/404.view.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/:catchAll(.*)',
    name: 'error_404',
    component: FourOFour
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
