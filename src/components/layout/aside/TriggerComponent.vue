<template>
  <div class="custom-trigger">
    <!-- 跳转github -->
    <span class="trigger-question" v-if="!collapsed">
      <a
        href="https://github.com/RicarTang/testframework_vue3"
        target="_blank"
        class="target"
        @click.stop="handleChildClick"
      >
        <question-circle-outlined />
      </a>
    </span>
    <!-- trigger按钮图标 -->
    <span class="trigger-icon">
      <left-outlined v-if="!collapsed" />
      <right-outlined v-else />
    </span>
    <!-- 退出登录头像 -->
    <div class="avatar-col" v-if="!collapsed">
      <el-dropdown>
        <el-col :span="24">
          <a-avatar :size="40" style="background-color: #87d068">{{ props.currentUser }}</a-avatar>
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
import { SwitchButton } from '@element-plus/icons-vue'
import { LeftOutlined, RightOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import fetchUser from '@/api/user/index'

// router
const router = useRouter()
// props
const props = defineProps({
  // 获取当前用户
  currentUser: {
    type: String,
    default: 'USER'
  },
  // 获取collapsed状态
  collapsed: {
    type: Boolean
  }
})
/**退出登录 */
async function logout() {
  await fetchUser.logout()
  message.success('退出成功🎉🎉🎉')
  router.replace('/login')
  localStorage.removeItem('token')
}
/**子元素阻止事件冒泡 */
function handleChildClick(event) {
  // 阻止点击时的事件冒泡
  event.stopPropagation()
}
</script>

<style lang="scss" scoped>
.custom-trigger {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-evenly;
  align-items: center; /*垂直居中 */
  .avatar-col {
    display: flex;
    justify-content: center; /*水平居中 */
    align-items: center; /*垂直居中 */
  }
  .trigger-question {
    .target {
      color: #fff;
    }
  }
}
</style>