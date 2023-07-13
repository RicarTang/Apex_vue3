import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAuthStore } from '@/stores/auth';
import moment from 'moment';

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
        requiresAuth: true,// 访问路由需要认证
      },
    },
  ]
})

// 添加导航守卫
router.beforeEach(async (to, from, next) => {
  // 加载进度条
  NProgress.start()
  // 修改标题
  window.document.title = to.meta.title
  // 如果路由需要进行身份验证
  if (to.meta.requiresAuth) {
    const store = useAuthStore() // 局部使用store
    // 判断有无存储token
    if (localStorage.token) {
      // env获取token的有效时间
      const tokenTime = import.meta.env.VITE_TOKEN_TIME
      // token过期时间
      // const tokenExpires = dayjs(store.getUser.exp).add(dayjs.duration({'minute' : 60}))
      const tokenExpires = moment.unix(store.getUser.exp).add(tokenTime, 'minutes')
      // 判断token是否过期
      if (moment(moment().valueOf()).isBefore(tokenExpires)) {
        // 已登录，继续导航到目标路由
        next();
      }
    } else {
      // 未登录，跳转到登录页
      next('/login');
    }
  } else {
    // 路由不需要进行身份验证，继续导航到目标路由
    next();
  }
})

router.afterEach(() => {
  // 结束加载进度条
  NProgress.done()
})

export default router
