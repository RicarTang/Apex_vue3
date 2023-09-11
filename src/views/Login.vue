<template>
    <div class="login">
        <div class="login-form">
            <el-form ref="ruleFormRef" :model="form.inputValue" label-width="120px" :rules="rules">
                <el-form-item label="Username:" prop="username">
                    <el-input v-model="form.inputValue.username" />
                </el-form-item>
                <el-form-item label="Password:" prop="password">
                    <el-input v-model="form.inputValue.password" />
                </el-form-item>
                <el-form-item class="submit">
                    <el-button round type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
  
<script setup>
import { onMounted, reactive } from 'vue'
import fetch from '@/api/index'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
//
const ruleFormRef = ref(null)

// 实例化router
const router = useRouter()

// 登录表单
const form = reactive({
    inputValue: {
        username: '',
        password: '',
    },
})
// 表单规则
const rules = {
    username: [
        {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
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
// 登录
const onSubmit = async () => {
    if (!ruleFormRef) {
        return//判断formEl是否为空，为空
    }
    ruleFormRef.value.validate(async (valid) => {
        if (valid) { //如果校验成功 请求数据
            try {
                const res = await fetch.fetchLogin(form.inputValue)
                ElMessage({
                    message: '登录成功',
                    type: 'success',
                })
                // 路由跳转
                router.replace('/')
            } catch (error) {
                console.log(error);
            }
        }
    })

}
// mount
onMounted(() => {
    // 渲染玩显示消息通知
    ElNotification({
        title: '欢迎登录！',
        message: '管理员账号：admin;密码：123456',
        duration: 5000
    });
}
)
</script>

<style lang="scss">
.login {
    height: 100%;
    width: 100%;
    background-image: url("/public/assets/background/background-login.jpg");
    background-position: 75% 35%;

    .login-form {
        display: flex;
        /* 表单内容居中 */
        justify-content: center;
        align-items: center;
        width: 28rem;
        height: 20rem;
        background-color: #227c9c;
        /* 居中表单盒子 */
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(50%, -50%);
        /* 设置圆角的大小 */
        border-radius: 10px;

        .el-form-item__label {

            color: #fff;

        }

        .submit {
            .el-button {
                width: 9rem;
                margin: 2.5rem 0 0 0;

            }
            .el-form-item__content{
                margin-left: 100px !important;
            }
        }


    }

}
</style>