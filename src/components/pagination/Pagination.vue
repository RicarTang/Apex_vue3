<template>
  <!-- 分页器 -->
  <div class="pager-box" v-if="pager">
    <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.limit" background
      :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>
  
<script setup>
import { ref } from 'vue'
// 传递子组件参数 分页器的分页操作处理函数,传递分页page,limit给父组件
const emit = defineEmits(['pagerFresh'])
// 接收父组件参数 所有 props 传值
const props = defineProps({
  // 数据总数--总数据条数
  total: {
    type: Number,
    default: 10
  },
  // 是否加载分页器
  pager: {
    type: Boolean,
    default: true
  },
})

// 分页器 默认数据
const queryParams = ref({ page: 1, limit: 10 })

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
</style>
  
  