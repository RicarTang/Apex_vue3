<template>
  <div>
    <a-modal v-model:open="props.open" :title="props.title" @ok="handleOk" @cancel="handleCancel">
      <a-timeline mode="alternate" pending="加载中...">
        <a-timeline-item v-for="(event, index) in props.events" :key="index" :color="event.color">
          <template #dot><CheckCircleOutlined style="font-size: 16px" /></template>
          {{ event.content }}
        </a-timeline-item>
      </a-timeline>
    </a-modal>
  </div>
</template>

<script setup>
import { CheckCircleOutlined } from '@ant-design/icons-vue'
// emit
const emit = defineEmits(['handleCancel'])
// props
const props = defineProps({
  // 模态框打开状态
  open: {
    type: Boolean,
    default: false
  },
  // 模态框标题
  title: {
    type: String,
    default: ''
  },
  // 时间轴展示数据
  events: {
    type: Array,
    default: []
  }
})

/**点击确定回调 */
function handleOk(e) {
  console.log(e)
}
/**关闭模态框回调 */
function handleCancel() {
  emit('handleCancel', false)
  console.log('关闭modal')
}
</script>

<style>
</style>