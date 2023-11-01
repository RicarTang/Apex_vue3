<template>
  <div>
    <a-modal
      v-model:open="props.open"
      :title="props.title"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :bodyStyle="{ padding: '20px' }"
    >
      <template #footer>
        <div class="footer" v-show="isFinish">
          <a-button type="primary" @click="clickFinish">完成测试</a-button>
        </div>
      </template>
      <a-steps
        v-model:currnet="current"
        :items="props.items"
        size="small"
        :percent="percent"
      ></a-steps>
      <div class="steps-content">
        <a-timeline mode="alternate" pending="加载中...">
          <a-timeline-item v-for="(event, index) in props.events" :key="index" :color="event.color">
            <template #dot><CheckCircleOutlined style="font-size: 16px" /></template>
            {{ event.content }}
          </a-timeline-item>
        </a-timeline>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { CheckCircleOutlined } from '@ant-design/icons-vue'

/**@TODO 后期使用pinia进行状态管理，使modal可以在关闭后重新打开也不回再次提交并且保持步骤与时间线状态 */

const current = ref(0)
const percent = ref(60)
const isFinish = ref(true)

// emit
const emit = defineEmits(['handleCancel','handleFinish'])
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
  // 步骤条展示
  items: {
    type: Array,
    default: []
  },
  // 时间轴展示数据
  events: {
    type: Array,
    default: []
  }
})

/**关闭模态框回调 */
function handleCancel() {
  emit('handleCancel', false)
  console.log('关闭modal')
}
/**点击finish按钮 */
function clickFinish(){
  emit('handleFinish', false)
}
</script>

<style lang="scss" scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 100px;
  text-align: center;
  padding-top: 20px;
}
</style>
