import axios from 'axios'
import NProgress from 'nprogress'
import { ElMessage } from 'element-plus'
import jwt_decode from 'jwt-decode'//解析token
import { useAuthStore } from '@/stores/auth/index';
import router from '@/router/index'  // axios拦截器只能导入router实例进行跳转

// 设置请求头和请求路径
axios.defaults.timeout = 10000 // 超时时间
axios.defaults.baseURL = import.meta.env.VITE_API_HOST  //后端host

// const router = useRouter()
// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    NProgress.start()
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    // 导入接口需要设置请求体为form-data
    if (config.url === '/testcase/import') {
      config.headers['Content-Type'] = 'multipart/form-data;'
    }
    if (localStorage.token) {
      config.headers.Authorization = 'Bearer ' + localStorage.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  }
)
// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    // 进度条
    NProgress.done()
    // success返回false时
    if (!response.data.success) {
      if (response.headers['content-type'] === 'application/json') {
        console.log(response)
        // elmessage 提示
        ElMessage({
          message: response.data.message,
          type: 'warning',
        })
      }

    }
    // 判断接口，拿取token
    if (response.config.url === '/user/login') {
      const token = response.data.result.access_token
      // 解析token
      const decode = jwt_decode(token);
      console.log(decode)
      //存储token解析的内容 以及修改登录的状态
      const store = useAuthStore();
      store.setAuth(!!decode) //由于decode是对象，所以对他取反再取反，双非就变成了布尔类型
      store.setUser(decode)
      // 存储token至localStorage
      localStorage.setItem('token', token)
    }


    return Promise.resolve(response)
  },
  (error) => {
    // 状态码不为2**时处理错误
    NProgress.done()
    let errMessage = '未知错误'
    if (error.response) {
      const status = error.response.status
      console.log("返回的状态吗", status)
      switch (status) {
        case 400:
          errMessage = '错误的请求'
          break
        case 401:
          errMessage = '未授权，请重新登录'
          router.replace({
            path: '/login',
            //登录成功后跳入浏览的当前页面
            query: { redirect: router.currentRoute.fullPath }
          })
          break
        case 403:
          errMessage = '拒绝访问'
          break
        case 404:
          errMessage = '请求地址出错'
          break
        case 405:
          errMessage = '请求方法未允许'
          break
        case 408:
          errMessage = '请求超时'
          break
        case 500:
          errMessage = '服务器端出错'
          break
        case 501:
          errMessage = '网络未实现'
          break
        case 502:
          errMessage = '网络错误'
          break
        case 503:
          errMessage = '服务不可用'
          break
        case 504:
          errMessage = '网络超时'
          break
        case 505:
          errMessage = 'http版本不支持该请求'
          break
        default:
          errMessage = `其他连接错误 --${error.response.status}`
      }
      ElMessage({
        message: errMessage,
        type: 'warning',
      })
    } else {
      console.log("返回的error没有response")
    }

    return Promise.reject(error.response) // 返回接口返回的错误信息
  }
)
export default axios
