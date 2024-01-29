<template>
  <el-collapse v-model="collapseValue">
    <el-collapse-item title="控制台" name="console" class="console-container">
      <div class="console-body">
        <p v-for="(log, index) in logs" :key="index" class="console-log">
          {{ log.message.message }}
        </p>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
  
  <script setup>
import { ref, computed, onDeactivated } from "vue";

const collapseValue = ref(["console"]);

const props = defineProps({
  // 测试日志
  logs: {
    type: Array,
    required: true,
  },
});

const logs = computed(() => props.logs);
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
  