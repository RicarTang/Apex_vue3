<template>
  <el-collapse v-model="collapseValue">
    <el-collapse-item title="控制台" name="console" class="console-container">
      <div class="console-body" ref="consoleBodyRef">
        <p v-for="(log, index) in logs" :key="index" class="console-log">
          {{ log.message.message }}
        </p>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
  
  <script setup name="Console">
import { ref, computed, watch } from "vue";

const collapseValue = ref(["console"]);
const consoleBodyRef = ref(null);

const props = defineProps({
  // 测试日志
  logs: {
    type: Array,
    required: true,
  },
});

const logs = computed(() => props.logs);

// 滚动到底部
function scrollToBottom() {
  const consoleBody = consoleBodyRef.value;
  if (consoleBody) {
    consoleBody.scrollTop = consoleBody.scrollHeight;
    console.log(consoleBody.scrollTop);
  }
}
onMounted(() => {
  // 在组件挂载后滚动到底部
  scrollToBottom();
});

watch(
  () => logs,
  (newLog, oldLog) => {
    // 在 logs 数组更新时滚动到底部
    scrollToBottom();
  },
  { deep: true }
);
</script>
  
  <style scoped>
.console-container {
  color: white;
}

.console-body {
  background-color: black;
  color: white;
  padding: 0 10px;
  overflow-y: auto;
  height: 400px;
}

.console-log {
  margin-bottom: 8px;
}
</style>
  