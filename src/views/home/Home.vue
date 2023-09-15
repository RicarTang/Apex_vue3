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
          <!-- 面包屑 -->
          <BreadcurmbComponent></BreadcurmbComponent>
          <!-- <el-empty v-if="showEmpty" description="description" /> -->
          <!-- 渲染子路由 -->
          <div class="main">
            <router-view></router-view>
          </div>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Menu from '@/views/layout/aside/Menu.vue'
import Header from '@/views/layout/header/Header.vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue'
import BreadcurmbComponent from '@/components/breadcrumb/Breadcurmb.vue';


const router = useRouter()

onMounted(() => {

});

</script>

<style lang="scss" scoped>
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
  width: 100%;
  /* 弹性布局align-items属性设置垂直居中对齐 */
  align-items: center;
  background-color: #b3c0d1;
  color: #333;
}

.el-aside {
  background-color: #2a3853;
  text-align: center;
  line-height: 200px;
}

.el-main {
  padding: 0 20px;
  background-color: #fff;
  color: #333;
  // text-align: center;
  // line-height: 160px;
  .main{
    display: flex;
    height: 45rem;
  }

}


/* .el-menu {
    background-color: #d3dce6;
} */
</style>