<template>
  <a-config-provider :locale="aLocale">
    <el-config-provider :locale="locale">
      <router-view/>
    </el-config-provider>
  </a-config-provider>
</template>
<script setup>
import { watchEffect } from 'vue' //watchEffect一进来就触发
import jwt_decode from 'jwt-decode'
import { useAuthStore } from '@/stores/auth/index'
import zhCn from 'element-plus/lib/locale/lang/zh-cn' // 全局element-plus组件使用中文
import aZhCN from 'ant-design-vue/es/locale/zh_CN' // 全局ant组件使用中文

const locale = zhCn
const aLocale = aZhCN

// 页面刷新，pinia中存储的状态依然存在
watchEffect(() => {
  //watchEffect页面一刷新，方法立即被调用
  if (localStorage.token) {
    const decode = jwt_decode(localStorage.token)
    const store = useAuthStore()
    store.setAuth(!!decode)
    store.setUser(decode)
  }
})
</script>
<style lang="scss"></style>

