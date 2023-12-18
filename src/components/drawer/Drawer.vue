<template>
  <a-drawer :open="props.drawerState" :title="props.title" @close="handleClose" width="800">
    <a-form ref="drawerRuleRef" :model="props.formData" :rules="props.rules" layout="vertical">
      <!-- 使用row和col布局 -->
      <a-row gutter="35">
        <a-col
          v-for="(field, index) in props.formFields"
          :key="index"
          :span="field.type === 'textarea' ? 24 : 12"
        >
          <!-- 使用 v-for 渲染表单字段 (prop属性必须要写，关系到表单规则验证)-->
          <a-form-item :label="field.label" :name="field.name">
            <!-- 根据 field 的类型来渲染不同类型的输入框 -->
            <template v-if="field.type === 'input'">
              <a-input
                v-model:value="props.formData[field.name]"
                type="input"
                size="large"
              ></a-input>
            </template>
            <template v-else-if="field.type === 'textarea'">
              <a-textarea v-model:value="props.formData[field.name]"></a-textarea>
            </template>
            <template v-else-if="field.type === 'select'">
              <a-select
                v-model:value="field.default"
                :options="field.options"
              >
              </a-select>
            </template>

            <!-- 可以根据需要添加其他字段类型的渲染 -->
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- 右上角区域插槽 -->
    <template #extra>
      <a-space>
        <a-button @click="cancelForm">取消</a-button>
        <a-button type="primary" @click="submit">{{
          confirmLoading ? '提交中 ...' : '提交'
        }}</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>
import { ref } from 'vue'
// form表单ref
const drawerRuleRef = ref()

const emit = defineEmits(['cancelForm', 'updateData'])
const props = defineProps({
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 抽屉显示状态
  drawerState: {
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
  // 确认按钮loading
  confirmLoading: {
    type: Boolean,
    default: false
  }
})
/**提交表单数据 */
function submit() {
  // if (!drawerRuleRef) {
  //   return //判断formEl是否为空，为空
  // }
  drawerRuleRef.value
    .validate()
    .then((valid) => {
      if (valid) {
        //如果校验成功 传递数据
        // 传递表单值
        console.log('formData数据', props.formData)
        emit('updateData', props.formData)
      }
    })
    .catch((error) => {
      console.log('表单验证错误', error)
    })
}
/**
 * 点击drawer关闭按钮触发事件
 * @param {*} done
 */
function handleClose(done) {
  ElMessageBox.confirm('是否提交？')
    .then(() => {
      // 传递表单值
      emit('updateData', props.formData)
    })
    .catch((eroor) => {
      // catch error
      console.log(eroor)
    })
}
/**关闭drawer后的回调函数 */
function cancelForm() {
  emit('cancelForm', false)
  console.log('关闭drawer')
}
</script>

<style lang="scss" scoped>
</style>