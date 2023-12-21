import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAuthStore } from '@/stores/auth/index';
import moment from 'moment';
import { ElMessage } from 'element-plus';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录路由
    {
      path: '/login',
      name: 'loginRoute',
      component: () => import('@/views/login/Login.vue'),
      meta: {
        title: '登录', // 设置页面标题
      },
    },
    // 首页路由
    {
      path: '/',
      name: 'homeRoute',
      // component: () => import('@/views/home/Home.vue'),
      component: () => import('@/components/layout/index.vue'),
      redirect: { name: 'workspaceRoute' },
      meta: {
        title: '主页', // 设置页面标题
        requiresAuth: true,// 访问路由需要认证
      },
      children: [
        // dashboard
        {
          path: 'dashboard',
          name: 'dashboardRoute',
          meta: {
            title: 'Dashboard', // 设置页面标题
            requiresAuth: true,// 访问路由需要认证
          },
          children: [
            {
              path: 'workspace',
              name: 'workspaceRoute',
              component: () => import('@/views/dashborad/Workspace.vue'),
              meta: {
                title: '工作台', // 设置页面标题
                requiresAuth: true,// 访问路由需要认证
                affix: true // 常驻tasView
              },
            }
          ]
        },
        // 用户
        {
          path: 'user',
          name: 'userRoute',
          meta: {
            // title: '用户',
            requiresAuth: true,// 访问路由需要认证
          },
          children: [
            {
              path: 'manager',
              name: 'userManagerRoute',
              meta: {
                title: '用户管理',
                requiresAuth: true,// 访问路由需要认证
              },
              redirect: { name: 'userManagerList' },
              children: [
                {
                  path: 'list',
                  name: 'userManagerList',
                  component: () => import('@/views/user/Users.vue'),
                  meta: {
                    title: '用户列表',
                    requiresAuth: true,// 访问路由需要认证
                  },
                },
                {
                  path: 'info/:id',
                  name: 'userManagerInfo',
                  component: () => import('@/views/user/Permission.vue'),
                  meta: {
                    title: '用户详情',
                    requiresAuth: true,// 访问路由需要认证
                  },
                },
              ]
            },
            {
              path: 'permission',
              name: 'userPermissionRoute',
              component: () => import('@/views/user/Permission.vue'),
              meta: {
                title: '权限管理',
                requiresAuth: true,// 访问路由需要认证
              },
            },
          ]
        },
        // 接口测试
        {
          path: 'apiTest',
          name: 'apiTestRoute',
          meta: {
            title: '接口测试', // 设置页面标题
            requiresAuth: true,// 访问路由需要认证
          },
          children: [
            {
              path: 'testCase',
              name: 'testCaseRoute',
              component: () => import('@/views/test/Testcase.vue'),
              meta: {
                title: '测试用例', // 设置页面标题
                requiresAuth: true,// 访问路由需要认证
              },
            },
            {
              path: 'testSuite',
              name: 'testSuiteRoute',
              component: () => import('@/views/test/Testsuite.vue'),
              meta: {
                title: '测试套件', // 设置页面标题
                requiresAuth: true,// 访问路由需要认证
              },
            },
            {
              path: 'testReport',
              name: 'testReportRoute',
              component: () => import('@/views/test/Testreport.vue'),
              meta: {
                title: '测试报告', // 设置页面标题
                requiresAuth: true,// 访问路由需要认证
              },
            },
          ]
        },
        // 配置
        {
          path: 'setting',
          name: 'settingRoute',
          meta: {
            title: '配置', // 设置页面标题
            requiresAuth: true,// 访问路由需要认证
          },
          children: [
            {
              path: 'testEnv',
              name: 'testEnvRoute',
              component: () => import('@/views/setting/Testenv.vue'),
              meta: {
                title: '测试环境', // 设置页面标题
                requiresAuth: true,// 访问路由需要认证
              },
            },
          ]
        },
      ]
    },



  ]
})

// 添加导航守卫
router.beforeEach(async (to, from, next) => {
  console.log(`导航至${to.path}`)
  // 修改标题
  window.document.title = to.meta.title
  // 如果路由需要进行身份验证
  if (to.meta.requiresAuth) {
    const store = useAuthStore() // 局部使用store
    // 判断有无存储token
    if (localStorage.token) {
      // 判断token是否过期
      if (moment(moment().valueOf()).isBefore(moment.unix(store.user.exp))) {
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

// router.afterEach(() => {
// })

export default router
