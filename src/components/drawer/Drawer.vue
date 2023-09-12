<template>
    <el-drawer :model-value="dialogState" :title="title" :before-close="handleClose" class="demo-drawer">
        <div class="demo-drawer__content">
            <el-form :model="form">
                <!-- <el-form-item label="Name" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Area" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="Please select activity area">
                        <el-option label="Area1" value="shanghai" />
                        <el-option label="Area2" value="beijing" />
                    </el-select>
                </el-form-item> -->
                表单
            </el-form>
            <div class="demo-drawer__footer">
                <el-button @click="cancelForm">Cancel</el-button>
                <el-button type="primary" :loading="loading" @click="onClick">{{
                    loading ? 'Submitting ...' : 'Submit'
                }}</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>
import { ref } from "vue"

const emit = defineEmits(['dialogState'])
const props = defineProps({
    // 标题
    title: {
        type: String,
        default: "修改"
    },
    // 抽屉显示状态
    dialogState: {
        type: Boolean,
        default: false
    }

})
const onClick = () => {
    console.log("点击")
}

function handleClose(done) {
    ElMessageBox.confirm('Do you want to submit?')
        .then(() => {
            //   loading.value = true
            console.log("关闭")
            emit('dialogState', false)
        })
        .catch(() => {
            // catch error
        })
}

const cancelForm = () => {
    //   loading.value = false
    emit('dialogState', false)
}

</script>

<style></style>