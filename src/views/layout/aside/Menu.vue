<template>
  <el-menu :router="true" :default-active="activeMenu" class="el-menu-vertical-demo" :collapse="isCollapse">
    <el-menu-item index="0">
      <el-icon :size="size" :color="color" v-if="isCollapse">
        <!-- 根据 isCollapse 来显示图标或标题 -->
        <ChromeFilled />
      </el-icon>
      <template #title>

        <h2>TF测试平台</h2>
      </template>
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <TrendCharts />
        </el-icon>
        <span>Dashboard</span>
      </template>
      <el-menu-item index="/workspace">
        <template #title>
          <span>工作台</span>
        </template>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <UserFilled />
        </el-icon>
        <span>用户</span>
      </template>
      <el-menu-item index="/users">
        <template #title><span>用户管理</span></template>
      </el-menu-item>
      <el-menu-item index="/permission">
        <template #title><span>权限管理</span></template>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon>
          <Management />
        </el-icon>
        <span>测试</span>
      </template>
      <el-menu-item index="/testsuites">
        <template #title><span>套件管理</span></template>
      </el-menu-item>
      <el-menu-item index="/testcases">
        <template #title><span>用例管理</span></template>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { onMounted, ref } from 'vue'
// 自动导入好像无效了，手动导入icon组件
import {
  ChromeFilled,
  UserFilled,
  Management,
  TrendCharts,
} from '@element-plus/icons-vue'
// 导入组件通信插件
import emitter from '@/utils/eventBus'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
// 菜单收纳状态
const isCollapse = ref(false)
// 默认激活菜单项
const activeMenu = ref('')


onMounted(() => {
  // 传递菜单收纳状态
  emitter.on("isCollapse", (info) => {
    isCollapse.value = info
  })
  // 拿取当前路由
  activeMenu.value = route.path
  console.log(activeMenu.value)
})
</script>

<style lang="scss" scoped>
// .el-menu-vertical-demo:not(.el-menu--collapse) {
//   // width: 200px;
//   // min-height: 400px;
//   height: 100%;
// }
/* // 重要以下就是添加menu的宽度和高度。 */
// .el-menu-container:not(.el-menu--collapse) {
//   width: 200px;
//   height: calc(100vh);
// }
</style>