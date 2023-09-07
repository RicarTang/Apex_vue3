import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAuthStore } from '@/stores/auth';
import moment from 'moment';
import { ElMessage } from 'element-plus';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'workspaceRoute' }
    },
    {
      path: '/login',
      name: 'loginRoute',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: '登录', // 设置页面标题
      },
    },
    {
      path: '/',
      name: 'homeRoute',
      component: () => import('@/views/Home.vue'),
      meta: {
        title: '主页', // 设置页面标题
        requiresAuth: true,// 访问路由需要认证
      },
      children: [
        {
          path: 'users',
          name: 'userRoute',
          component: () => import('@/components/table/Users.vue'),
          meta: {
            title: '用户',
            requiresAuth: true,// 访问路由需要认证
          },
        },
        {
          path: 'workspace',
          name: 'workspaceRoute',
          component: () => import('@/components/dashborad/Workspace.vue'),
          meta: {
            title: '工作台', // 设置页面标题
            requiresAuth: true,// 访问路由需要认证
          },
        }
      ]
    },



  ]
})

// 添加导航守卫
router.beforeEach(async (to, from, next) => {
  console.log(`导航至${to.path}`)
  // 加载进度条
  NProgress.start()
  // 修改标题
  window.document.title = to.meta.title
  // 如果路由需要进行身份验证
  if (to.meta.requiresAuth) {
    const store = useAuthStore() // 局部使用store
    // 判断有无存储token
    if (localStorage.token) {
      // 判断token是否过期
      if (moment(moment().valueOf()).isBefore(moment.unix(store.getUser.exp))) {
        // 已登录，继续导航到目标路由
        next();
      } else {
        // 登陆token过期，跳转login
        next({ name: 'loginRoute' })
        ElMessage.warning('登陆过期，请重新登陆！')
      }
    } else {
      // 未登录，跳转到登录页
      next({ name: 'loginRoute' });
      ElMessage.warning('未登录，请先登录！')
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
