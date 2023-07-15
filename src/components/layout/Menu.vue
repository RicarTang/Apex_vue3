<template>
  <el-menu default-active="1" class="el-menu-container" :collapse="isCollapse" :unique-opened=true
    background-color="#304156" text-color="#FFFFFF" active-text-color="#409eff" @open="handleOpen" @close="handleClose">
    <!-- // 把logo放到menu里面是觉得方便，不需要修改class。不喜欢的这里可以删除 -->
    <el-menu-item index="0">
      <!-- // isCollapse为true是缩进显示图标不显示文字，展开显示文字不显示图标 -->
      <el-icon v-if="isCollapse">
        <HelpFilled />
      </el-icon>
      <template #title>
        <!-- <div >简单测试平台</div> -->
        <h2>简单测试平台</h2>
      </template>
    </el-menu-item>
    <el-menu-item index="1">
      <el-icon>
        <ElementPlus />
      </el-icon>
      <template #title>
        首页
      </template>
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