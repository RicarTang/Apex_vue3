<template>
    <div class="custom-table">
        <!-- 此处 可以 拓展 （elplus table 的特殊 表格props属性 ） -->
        <!-- :data="tableData" 绑定表格数据 -->
        <div class="table-box">
            <el-table :data="tableData" v-loading="loading" max-height="40rem" border>
                <!-- 多选框 -->
                <el-table-column :align="center ? 'center' : ''" type="selection" v-if="selected" />
                <!-- 接受 传值 渲染 表头 -->
                <!-- 表头数据的 单独控制tableController -->
                <el-table-column :align="center ? 'center' : ''" v-for="(t, index) in tableController" :key="index"
                    :label="t.label" :prop="t.prop" :width="t.width ? t.width : ''" sortable>
                    <!-- #default="scope" 作用域插槽 使用子组件内部数据 操作列 -->
                    <template #default="scope" v-if="t.type === 'template'">
                        <slot :name="t.label" :row="scope.row">
                            <el-button size="small" :icon="Edit" type="warning"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" :icon="Delete" type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </slot>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>
<script setup>
import { ref } from "vue";
import { Delete, Edit } from '@element-plus/icons-vue'


// 接收父组件参数 所有 props 传值
const props = defineProps({
    // 表格数据
    tableData: {
        type: Array,
        default: []
    },
    // 表头数据
    tableController: {
        type: Array,
        default: []
    },
    // 是否加载多选
    selected: {
        type: Boolean,
        default: true
    },
    // 内容居中
    center: {
        type: Boolean,
        default: true
    },
    // 表格loading
    loading: {
        type: Boolean,
        default: false
    },
})


// 编辑数据
const handleEdit = (index, row) => {
    console.log(index, row)
    console.log(row.id)
}
// 删除数据
const handleDelete = (index, row) => {
    console.log(index, row)
}

</script>
<style lang="scss" scoped>
/* 固定高度 */
.custom-table {
    display: flex;
    /* 设置主轴方向为垂直（上下） */
    flex-direction: column;
    // height: 43rem;
    height: 100%;
    width: 100%;
    // background-color: #fff;

    .table-box {
        display: flex;
        width: 100%;
        // height: 80%;

        .el-table {
            border-radius: 8px;
        }
    }



}
</style>
  