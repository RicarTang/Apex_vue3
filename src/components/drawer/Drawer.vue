<template>
  <el-drawer :model-value="props.dialogState" :title="props.title" :before-close="handleClose">
    <div class="drawer__content">
      <div class="drawer__main">
        <el-form
          ref="drawerRuleRef"
          :model="props.formData"
          :rules="props.rules"
          label-position="right"
          label-width="auto"
        >
          <!-- 使用 v-for 渲染表单字段 (prop属性必须要写，关系到表单规则验证)-->
          <el-form-item
            v-for="(field, index) in props.formFields"
            :label="field.label"
            :key="index"
            :prop="field.name"
          >
            <!-- 根据 field 的类型来渲染不同类型的输入框 -->
            <template v-if="field.type === 'input'">
              <el-input v-model="props.formData[field.name]"></el-input>
            </template>
            <template v-else-if="field.type === 'select'">
              <el-select v-model="field.default">
                <el-option
                  v-for="(option, optionIndex) in field.options"
                  :key="optionIndex"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </template>
            <!-- 可以根据需要添加其他字段类型的渲染 -->
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="drawer__footer">
      <el-button @click="cancelForm">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">{{
        loading ? '提交中 ...' : '提交'
      }}</el-button>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
// form表单ref
const drawerRuleRef = ref(null)
// button loading状态
// const buttonLoading = ref(props.loading)

const emit = defineEmits(['dialogState', 'updateData'])
const props = defineProps({
  // 标题
  title: {
    type: String,
    default: ''
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
/**提交表单数据 */
function submit() {
  if (!drawerRuleRef) {
    return //判断formEl是否为空，为空
  }
  drawerRuleRef.value.validate(async (valid) => {
    if (valid) {
      //如果校验成功 传递数据
      // 传递表单值
      emit('updateData', props.formData)
    }
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
  emit('dialogState', false)
}
</script>

<style lang="scss">
.el-drawer__body {
  display: flex;
  /* 设置主轴方向为垂直（上下） */
  flex-direction: column;
}

.drawer__content {
  display: flex;

  /**设置水平居中 */
  //   justify-content: center;
  .drawer__main {
    display: flex;
  }
}
.drawer__footer {
  display: flex;
  margin-top: auto;
  justify-content: flex-end;
}
</style>