<template>
  <div class="app-container">
    <el-form label-width="100px">
      <div class="operation">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </div>
    </el-form>
    <h4 class="form-header h4">套件信息</h4>
    <el-form :model="form" label-width="80px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="套件编号" prop="suiteNo">
            <el-input v-model="form.suiteNo" />
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="套件名称" prop="suiteTitle">
            <el-input v-model="form.suiteTitle" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="套件说明" prop="remark">
            <el-input v-model="form.remark" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4 class="form-header h4">套件用例信息</h4>
    <el-table
      v-loading="loading"
      :row-key="getRowKey"
      @row-click="clickRow"
      ref="caseRef"
      @selection-change="handleSelectionChange"
      :data="testcases.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
    >
      <el-table-column label="序号" width="55" type="index" align="center">
        <template #default="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="55"
      ></el-table-column>
      <el-table-column label="用例编号" align="center" prop="caseNo">
        <template #default="scope">
          <router-link
            :to="{ name: 'CaseInfo', params: { caseId: scope.row.id } }"
            :style="{ color: 'blue', cursor: 'pointer' }"
          >
            {{ scope.row.caseNo }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="用例标题" align="center" prop="caseTitle" />
      <el-table-column label="所属模块" align="center" prop="caseModule" />
      <el-table-column label="api路径" align="center" prop="apiPath" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="pageNum"
      v-model:limit="pageSize"
    />
  </div>
</template>
 
 <script setup name="SuiteInfo">
import { getSuite } from "@/api/test/suite";

const route = useRoute();
const { proxy } = getCurrentInstance();

const loading = ref(true);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
const roleIds = ref([]);
const testcases = ref([]);
const form = ref({
  nickName: undefined,
  userName: undefined,
  userId: undefined,
});

/** 单击选中行数据 */
function clickRow(row) {
  proxy.$refs["caseRef"].toggleRowSelection(row);
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  roleIds.value = selection.map((item) => item.roleId);
}
/** 保存选中的数据编号 */
function getRowKey(row) {
  return row.roleId;
}
/** 关闭按钮 */
function close() {
  const obj = { path: "/system/user" };
  proxy.$tab.closeOpenPage(obj);
}
/** 提交按钮 */
function submitForm() {
  const userId = form.value.userId;
  const rIds = roleIds.value.join(",");
  updateAuthRole({ userId: userId, roleIds: rIds }).then((response) => {
    proxy.$modal.msgSuccess("授权成功");
    close();
  });
}

(() => {
  const suiteId = route.params && route.params.suiteId;
  if (suiteId) {
    loading.value = true;
    getSuite(suiteId).then((response) => {
      form.value = response.result;
      testcases.value = response.result.testcases;
      total.value = testcases.value.length;
      //    nextTick(() => {
      //      roles.value.forEach(row => {
      //        if (row.flag) {
      //          proxy.$refs["roleRef"].toggleRowSelection(row);
      //        }
      //      });
      //    });
      loading.value = false;
    });
  }
})();
</script>
<style lang="scss" scoped>
.operation{
    text-align: right;
}
</style>
 