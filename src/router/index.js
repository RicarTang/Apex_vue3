import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'login',
    //   component: () => import('../views/LoginView.vue')
    // },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
  ]
})

export default router
