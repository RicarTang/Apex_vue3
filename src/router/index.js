import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: {
        title: 'Login', // 设置页面标题
      },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: {
        title: 'Home Page', // 设置页面标题
      },
    },
  ]
})


router.beforeEach((to, from, next) => {
  // 加载进度条
  NProgress.start()
  // 修改标题
  window.document.title = to.meta.title
  next()
})

router.afterEach(() => {
  // 结束加载进度条
  NProgress.done()
})

export default router
