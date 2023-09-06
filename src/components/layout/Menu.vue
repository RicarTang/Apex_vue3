<template>
  <el-menu default-active="1-1" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
    @close="handleClose">
    <el-menu-item index="0">
      <el-icon :size="size" :color="color" v-if="isCollapse">
          <!-- 根据 isCollapse 来显示图标或标题 -->
          <ChromeFilled />
        </el-icon>
      <template #title>
        
        <h2>简单测试平台</h2>
      </template>
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <location />
        </el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item-group>
        <template #title><span>Group One</span></template>
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title><span>item four</span></template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <template #title>Navigator Two</template>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon>
        <document />
      </el-icon>
      <template #title>Navigator Three</template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><KnifeFork /></el-icon>
      <template #title>Navigator Four</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  KnifeFork,
  ChromeFilled,
} from '@element-plus/icons-vue'
// 导入组件通信插件
import emitter from '@/utils/eventBus'
const isCollapse = ref(false)
onMounted(() => {
  emitter.on("isCollapse", (info) => {
    isCollapse.value = info
  })
})
</script>

<style lang="scss" scoped>
/* .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
} */
/* // 重要以下就是添加menu的宽度和高度。 */
.el-menu-container:not(.el-menu--collapse) {
  width: 200px;
  height: calc(100vh);
}
</style>