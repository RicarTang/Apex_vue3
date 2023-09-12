<template>
    <div class="custom-table">
        <!-- 此处 可以 拓展 （elplus table 的特殊 表格props属性 ） -->
        <!-- :data="tableData" 绑定表格数据 -->
        <div class="table-box">
            <el-table :data="tableData" v-loading="loading" max-height="40rem">
                <!-- 多选框 -->
                <el-table-column :align="center ? 'center' : ''" type="selection" v-if="selected" />
                <!-- 接受 传值 渲染 表头 -->
                <!-- 表头数据的 单独控制tableController -->
                <el-table-column :align="center ? 'center' : ''" v-for="t in tableController" :key="t.prop" :label="t.label"
                    :prop="t.prop" :width="t.width ? t.width : ''"  sortable>
                    <!-- #default="scope" 作用域插槽 使用子组件内部数据 操作列 -->
                    <template #default="scope" v-if="t.type === 'template'">
                        <slot :name="t.key" :row="scope.row">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                            <el-button size="small" type="danger"
                                @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                        </slot>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页器 -->
        <div class="pager-box" v-if="pager">
            <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.limit" background
                :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";

// 传递子组件参数 分页器的分页操作处理函数,传递分页page,limit给父组件
const emit = defineEmits(['pagerFresh'])
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
    // 分页所属--总数据条数
    total: {
        type: Number,
        default: 10
    },
    // 是否加载分页器
    pager: {
        type: Boolean,
        default: true
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
    // 默认页面条数
    // defaultPageSize:{
    //     type: Number,
    //     // default:10
    // }
})
// 分页器 默认数据
let queryParams = ref({ page: 1, limit: 10 })

// 打印插槽scoped
const handleEdit = (index, row) => {
    console.log(index, row)
    console.log(row.id)
}
const handleDelete = (index, row) => {
    console.log(index, row)
}
// 分页器处理函数
// 单页数据条数改变
function handleSizeChange(ev) {
    queryParams.value.limit = ev;
    emit('pagerFresh', JSON.parse(JSON.stringify(queryParams.value)))
}
// 页数改变
function handleCurrentChange(ev) {
    queryParams.value.page = ev;
    emit('pagerFresh', JSON.parse(JSON.stringify(queryParams.value)))
}
</script>
<style lang="scss" scoped>
/* 固定高度 */
.custom-table {
    display: flex;
    /* 设置主轴方向为垂直（上下） */
    flex-direction: column;
    height: 44.5rem;
    width: 100%;
    // background-color: #fff;

    .table-box {
        display: flex;
        width: 100%;
        height: 80%;

        .el-table {
            border-radius: 8px;
        }
    }

    // 分页器位置
    .pager-box {
        display: flex;
        height: 5rem;
        /**固定组件到底部 */
        margin-top: auto !important;
        justify-content: center;
        // background-color: #fff;
        border-radius: 8px;
    }

    // .el-pagination{
    //   height: 20%;
    //   justify-content:center;
    // }
}
</style>
  