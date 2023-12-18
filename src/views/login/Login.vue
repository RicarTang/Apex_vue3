<template>
  <div class="login">
    <a-form class="login-form" ref="formRef" :model="form" :rules="rules" layout="vertical">
      <div class="logo">
        <img src="/assets/logo/favicon-32x32.png" alt="Logo" />
        <h1 class="title">TF测试平台</h1>
      </div>
      <a-form-item name="username">
        <a-input v-model:value="form.username" allow-clear>
          <template #prefix>
            <user-outlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="password">
        <a-input-password v-model:value="form.password" allow-clear>
          <template #prefix>
            <lock-outlined />
          </template>
        </a-input-password>
      </a-form-item>
      <!-- 登录按钮 -->
      <a-row class="login-row">
        <a-col :span="24" class="login-col">
          <a-button
            :loading="loading"
            :style="{ width: '100%' }"
            shape="round"
            type="primary"
            @click="onSubmit"
            @keydown.enter="keyDown()"
            >登录</a-button
          >
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
  
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import fetchUser from '@/api/user/index'
import { useRouter } from 'vue-router'
import { notification, message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
// refs
const formRef = ref()
// 实例化router
const router = useRouter()

// loading
const loading = ref(false)

// 登录表单
const form = ref({
  username: 'admin',
  password: '123456'
})
// 表单规则
const rules = {
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    },
    {
      max: 20,
      message: '用户名长度应小于20字符!',
      trigger: 'change'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 18,
      message: '密码长度需要在6-18位之间',
      trigger: 'change'
    }
  ]
}
/**
 * 登录
 */
function onSubmit() {
  formRef.value
    .validate()
    .then(async () => {
      loading.value = true
      //如果校验成功 请求数据
      const res = await fetchUser.login(form.value)
      message.success('登录成功🎉🎉🎉')
      // 路由跳转
      router.replace('/')
    })
    .catch((error) => {
      console.log(error)
      loading.value = false
    })
    .finally(() => {
      loading.value = false
    })
}
/**回车键登录 */
function keyDown(e) {
  if (e.keyCode === 13) {
    console.log(e.keyCode)
    onSubmit()
  }
}

onMounted(() => {
  // 渲染玩显示消息通知
  notification.info({
    message: '欢迎登录！',
    description: '管理员账号：admin;密码：123456'
  })
  //绑定监听事件
  window.addEventListener('keydown', keyDown)
})
onUnmounted(() => {
  //销毁事件
  window.removeEventListener('keydown', keyDown, false)
})
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  /**设置登录页背景 */
  height: 100%;
  width: 100%;
  background-image: url('/assets/background/bg.svg');
  background-position: 75% 35%;

  .login-form {
    // display: flex;
    /* 表单内容居中 */
    // justify-content: center;
    // align-items: center;
    width: 20rem;
    height: 20rem;
    // background: linear-gradient(to bottom right,#e7ecf2, #f2f2f2); /* 背景渐变 */
    // backdrop-filter: blur(10px); /* 添加10像素的高斯模糊效果 */
    // box-shadow: 10px 10px 20px 0px rgba(0, 0, 0, 0.3); /* 添加阴影 */
    /* 居中表单盒子 */
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* 设置圆角的大小 */
    border-radius: 10px;
    .logo {
      display: flex;
      margin-bottom: 30px;
      justify-content: center; /*水平居中 */
      align-items: center; /*垂直居中 */
      img {
        width: 32px;
        height: 32px;
      }
      .title {
        font-family: 'Times New Roman', Times, serif;
        margin-left: 10px;
        text-align: center;
        color: #666666;
      }
    }
    .login-row {
      margin-top: 5rem;
      // 按钮居中
      .login-col {
        text-align: center;
      }
    }
    /**::v-deep渗透子组件样式 */
    // ::v-deep .el-form-item__label {
    //   color: #fff;
    // }
  }
}
</style>