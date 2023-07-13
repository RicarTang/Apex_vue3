<template>
    <div class="login">
        <el-form ref="ruleFormRef" :model="form.inputValue" label-width="120px" :rules="rules">
            <el-form-item label="Username:" prop="username">
                <el-input v-model="form.inputValue.username" />
            </el-form-item>
            <el-form-item label="Password:" prop="password">
                <el-input v-model="form.inputValue.password" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script setup>
import { reactive } from 'vue'
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
                router.push('/')
            } catch (error) {
                console.log(error);
            }
        }
    })

}
</script>

<style scoped>
.login {
    display: flex;
    /* 表单内容居中 */
    justify-content: center;
    align-items: center;
    width: 28rem;
    height: 20rem;
    background-color: bisque;
    /* 居中表单盒子 */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    /* 设置圆角的大小 */

}
</style>