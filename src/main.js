import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'element-plus/theme-chalk/src/message.scss'  // 手动导入element+的message样式文件
// 修改element组件文字未中文
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
// 
import mitt from "mitt"
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
const app = createApp(App)

// 关闭控制台开发者警告
// app.config.productionTip = false
app.use(createPinia())
app.use(router)
app.use(mitt)
app.use(ElementPlus, { locale }) // 全局使用locale
app.mount('#app')
