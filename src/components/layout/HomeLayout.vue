<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <!-- 自定义触发器 -->
      <template #trigger>
        <!-- 自定义的触发器内容 -->
        <trigger-component :currentUser="currentUser" :collapsed="collapsed"></trigger-component>
      </template>
      <div class="logo">
        <img src="/assets/logo/favicon-32x32.png" alt="Logo" />
        <h2 class="title" v-if="!collapsed">TF测试平台</h2>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" @click="clickItem">
        <a-sub-menu key="dashboard">
          <template #title>
            <span>
              <dashboard-outlined />
              <span>Dashboard</span>
            </span>
          </template>
          <a-menu-item key="workspace"> 工作台 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="user">
          <template #title>
            <span>
              <user-outlined />
              <span>用户</span>
            </span>
          </template>
          <a-menu-item key="manager"> 用户管理 </a-menu-item>
          <a-menu-item key="permission"> 权限管理 </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="apiTest">
          <template #title>
            <span>
              <api-filled/>
              <span>接口测试</span>
            </span>
          </template>
          <a-menu-item key="testSuite">测试套件</a-menu-item>
          <a-menu-item key="testCase">测试用例</a-menu-item>
          <a-menu-item key="testReport">测试报告</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="setting">
          <template #title>
            <span>
              <setting-outlined />
              <span>配置</span>
            </span>
          </template>
          <a-menu-item key="testEnv">测试环境</a-menu-item>
          <a-menu-item key="testAdd">测试地址</a-menu-item>
          <a-menu-item key="globalVariable">全局变量</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- layout header -->
      <a-layout-header style="background: #fff; padding: 0">
        <Header :currentUser="currentUser"></Header>
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <!-- <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb> -->
        <div class="layout-content">
          <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        api TestFramework ©2023 Tang个人出品 <a href="https://beian.miit.gov.cn/" target="_blank">湘ICP备2023022918号</a>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from './header/Header.vue'
import TriggerComponent from './aside/TriggerComponent.vue'
import {
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  ApiFilled
} from '@ant-design/icons-vue'
import fetch from '@/api/index'

// 菜单展开状态
const collapsed = ref(false)
// 当前路由
const selectedKeys = ref([])

// route
const route = useRoute()
const router = useRouter()
const currentUser = ref('')
// mounted
onMounted(() => {
  // 拿取当前路由
  const pathArray = route.path.split('/').filter((item) => item !== '')
  selectedKeys.value = pathArray
  // 拿取用户信息
  getCurrentUser()
})
/**
 * 点击menu item实现路由跳转
 * @param {*} param0
 */
function clickItem({ keyPath }) {
  const path = '/' + keyPath.join('/')
  router.push(path)
}
/**得到当前用户 */
async function getCurrentUser() {
  const user = await fetch.getCurrentUser()
  currentUser.value = user.data.result.username
}
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  justify-content: center; /*水平居中 */
  align-items: center; /*垂直居中 */
  height: 32px;
  margin: 16px;
  padding: 0px 8px;
  .title {
    color: #fff;
    white-space: nowrap; /**不换行 */
  }
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>