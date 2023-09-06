<template>
  <!-- 首页布局容器 -->
  <div class="common-layout">
    <el-container>
      <el-aside width="auto">
        <!-- 菜单组件 -->
        <Menu></Menu>
      </el-aside>
      <el-container>
        <el-header>
          <!-- header组件 -->
          <Header></Header>
        </el-header>
        <el-main>
          <!-- 渲染子路由 -->
          <!-- router-link相当于a标签，点击跳转路由 -->
          <el-button type="primary" @click="goToUser">
            <router-link to="/home/users">所有用户</router-link>
          </el-button>

          <router-view>

          </router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Menu from '@/components/layout/Menu.vue'
import Header from '@/components/layout/Header.vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
const testButton = () => {
  ElMessage({ showClose: true, type: 'info', message: 'dianjile' })
}

const router = useRouter()

// 路由跳转
const navigateToUser = () =>{
  router.push("/home/users")
}
onMounted(() => {
  // 渲染玩显示消息通知
  ElNotification({
    title: '哈哈哈',
    message: '这是一个简单的接口测试平台雏形',
    duration: 5000
  });
  navigateToUser()
});

</script>

<style scoped>
.common-layout {
  height: 100%;
}

.el-container {
  padding: 0px;
  margin: 0px;
  height: 100%;
  width: 100%;
}

.el-header,
.el-footer {
  display: flex;
  /* 弹性布局align-items属性设置垂直居中对齐 */
  align-items: center;
  background-color: #b3c0d1;
  color: #333;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

/* .el-menu {
    background-color: #d3dce6;
} */
</style>