<template>
    <el-drawer :model-value="dialogState" :title="title" :before-close="handleClose">
        <div class="drawer__content">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules">
                <!-- 使用 v-for 渲染表单字段 -->
                <el-form-item v-for="(field, index) in formFields" :label="field.label" :key="index">
                    <!-- 根据 field 的类型来渲染不同类型的输入框 -->
                    <template v-if="field.type === 'input'">
                        <el-input v-model="formData[field.name]"></el-input>
                    </template>
                    <template v-else-if="field.type === 'select'">
                        <el-select v-model="field.default">
                            <el-option v-for="(option, optionIndex) in field.options" :key="optionIndex"
                                :label="option.label" :value="option.value"></el-option>
                        </el-select>
                    </template>
                    <!-- 可以根据需要添加其他字段类型的渲染 -->
                </el-form-item>
            </el-form>
            <div class="drawer__footer">
                <el-button @click="cancelForm">取消</el-button>
                <el-button type="primary" :loading="loading" @click="submit">{{
                    loading ? '提交中 ...' : '提交'
                }}</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>
let timer
const loading = ref(false)

const emit = defineEmits(['dialogState', 'updateData'])
const props = defineProps({
    // 标题
    title: {
        type: String,
        default: ""
    },
    // 抽屉显示状态
    dialogState: {
        type: Boolean,
        default: false
    },
    // 表单label字段
    formFields: {
        type: Array,
        default: []
    },
    // 表单
    formData: {
        type: Object,
        default: {}
    },
    // 表单规则
    rules: {
        type: Object,
        default: {}
    },
    // loading
    loading: {
        type: Boolean,
        default: false
    }

})
const submit = () => {
    // 传递表单值
    emit('updateData', props.formData)

    // 关闭
    cancelForm()
}

function handleClose(done) {
    ElMessageBox.confirm('是否提交？')
        .then(() => {
            loading.value = true
            timer = setTimeout(() => {
                done()
                // 动画关闭需要一定的时间
                setTimeout(() => {
                    loading.value = false
                }, 400)
            }, 2000)
        })
        .catch(() => {
            // catch error
        })
}

const cancelForm = () => {
    //   loading.value = false
    clearTimeout(timer)
    emit('dialogState', false);
    console.log(props.rules)
}

</script>

<style lang="scss" scoped></style>