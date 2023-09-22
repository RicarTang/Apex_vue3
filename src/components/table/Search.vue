<template>
    <!-- 搜索 -->
    <div class="header">
        <el-form :inline="true" :model="props.formInline" class="demo-form-inline">
            <!-- 新增按钮 -->
            <el-form-item>
                <el-button type="primary" :icon="Plus" @click="clickAddButton">新增</el-button>
            </el-form-item>
            <!-- 删除按钮 -->
            <el-form-item>
                <el-button type="danger" :icon="Delete" @click="clickDeleteButton"
                    :disabled="tableSelected.length === 0">删除</el-button>
            </el-form-item>
            <el-form-item v-for="(field, index) in props.formFields" :label="field.label" :key="index" :prop="field.name">
                <!-- 根据 field 的类型来渲染不同类型的输入框 -->
                <template v-if="field.type === 'input'">
                    <el-input v-model="props.formInline[field.name]"
                        :placeholder="props.formInline[field.placeholder]" clearable></el-input>
                </template>
                <template v-else-if="field.type === 'select'">
                    <el-select v-model="field.default">
                        <el-option v-for="(option, optionIndex) in field.options" :key="optionIndex" :label="option.label"
                            :value="option.value"></el-option>
                    </el-select>
                </template>
                <!-- 搜索按钮 -->
                <!-- <template #default="scope" v-if="t.type === 'template'">
                    <slot :name="t.label" :row="scope.row">
                        <el-button type="primary" :icon="Search" @click="searchUser(scope.$index,)">搜索</el-button>
                    </slot>
                </template> -->
            </el-form-item>
            <!-- 搜索按钮 -->
            <el-form-item>
                <el-button type="primary" :icon="Search" @click="clickSearch">搜索</el-button>
            </el-form-item>
            <!-- 插槽,预留其他按钮 -->
            <slot></slot>
        </el-form>
    </div>
</template>

<script setup>
import { Plus, Delete, Search } from '@element-plus/icons-vue'

// emit
const emit = defineEmits(['clickAdd', 'clickDelete', 'clickSearch'])
// props
const props = defineProps({
    // 表格数据多选框
    tableSelected: {
        type: Array,
    },
    // form model
    formInline: {
        type: Object,
        default: {}
    },
    formFields: {
        type: Array,
        default: []
    }
})


function clickAddButton() {
    // emit 点击状态
    emit('clickAdd')
    console.log('点击了新增按钮')
}
function clickDeleteButton() {
    // emit 已经选择数据的数组
    console.log('点击了删除按钮')
    emit('clickDelete')
}
function clickSearch() {
    // emit 已经选择数据的数组
    console.log('点击了搜索按钮')
    emit('clickSearch')
}


</script>

<style lang="scss" scoped>
.header {
    display: flex;
    margin: 6px 0;
    padding: 6px 0;
}
</style>