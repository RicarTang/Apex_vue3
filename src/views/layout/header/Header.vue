<template>
  <div class="header-container">
    <div class="avatar-col">
      <el-dropdown>
        <el-col :span="24">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        </el-col>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">
              <el-icon>
                <SwitchButton />
              </el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 导入组件通信插件
import fetch from '@/api/index'
import { useRouter } from 'vue-router'
import { SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()

const logout = async () => {
  await fetch.logout()
  ElMessage({
    message: '退出登录',
    type: 'success'
  })
  router.replace('/login')
  localStorage.removeItem('token')
}
</script>

<style lang="scss" scoped>
.header-container {
  /*继承父元素所有属性 */
  display: flex;
  align-items: center;
  padding: 0px;
  .avatar-col {
    margin-left: auto;
  }
}
</style>