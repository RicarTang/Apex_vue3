import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'element-plus/theme-chalk/src/message.scss'  // 手动导入element+的message样式文件
// 
import mitt from "mitt"
// echarts
import echarts from '@/plugins/echarts'

NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
const app = createApp(App)

// 全局挂载echarts
app.provide("echarts",echarts)  // 通过provide注入

// 关闭控制台开发者警告
// app.config.productionTip = false
app.use(createPinia())
app.use(router)
app.use(mitt)
app.mount('#app')
