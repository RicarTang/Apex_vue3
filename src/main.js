import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'element-plus/theme-chalk/src/message.scss'  // 手动导入element+的message样式文件
import mitt from "mitt"
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(mitt)
app.mount('#app')
