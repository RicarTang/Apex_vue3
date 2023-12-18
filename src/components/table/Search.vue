<template>
  <!-- 搜索 -->
  <div class="header">
    <a-form class="demo-form-inline" :model="props.formInline" layout="horizontal">
      <a-row :gutter="30">
        <a-col>
          <!-- 新增按钮 -->
          <a-form-item>
            <a-button type="primary" :icon="h(PlusCircleFilled)" @click="clickAddButton"
              >新增
            </a-button>
          </a-form-item>
        </a-col>
        <a-col>
          <!-- 删除按钮 -->
          <a-form-item>
            <a-button
              danger
              :icon="h(DeleteFilled)"
              @click="clickDeleteButton"
              :disabled="tableSelected.length === 0"
              >删除</a-button
            >
          </a-form-item>
        </a-col>
        <a-col v-for="(field, index) in props.formFields" :key="index">
          <!-- 根据 field 的类型来渲染不同类型的输入框 -->
          <a-form-item :label="field.label" :name="field.name">
            <!-- input search -->
            <template v-if="field.type === 'input'">
              <a-input-search
                v-model:value="props.formInline[field.name]"
                :placeholder="props.formInline[field.placeholder]"
                allow-clear
                @search="clickSearch"
              >
              </a-input-search>
            </template>
            <!-- select -->
            <template v-else-if="field.type === 'select'">
              <a-select v-model:value="field.default" :options="field.options"> </a-select>
            </template>
          </a-form-item>
        </a-col>
        <!-- 搜索按钮 -->
        <!-- <el-form-item>
        <el-button type="primary" :icon="Search" @click="clickSearch">搜索</el-button>
      </el-form-item> -->
        <!-- 插槽,预留其他按钮 -->
        <slot></slot>
      </a-row>
    </a-form>
  </div>
</template>

<script setup>
import { h } from 'vue'
import { PlusCircleFilled, DeleteFilled } from '@ant-design/icons-vue'

// emit
const emit = defineEmits(['clickAdd', 'clickDelete', 'clickSearch'])
// props
const props = defineProps({
  // 表格数据多选框
  tableSelected: {
    type: Array
  },
  // form model双向绑定
  formInline: {
    type: Object,
    default: {}
  },
  // 搜索字段
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
  // .search-btn{
  //   background-color: #FAFAFA;
  // }
}
</style>