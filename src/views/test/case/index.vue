<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用例数据-->
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryRef"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="用例标题" prop="caseTitle">
            <el-input
              v-model="queryParams.caseTitle"
              placeholder="请输入用例标题"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="所属套件" prop="caseSuite">
            <el-input
              v-model="queryParams.caseSuite"
              placeholder="请输入测试套件"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="所属模块" prop="caseModule">
            <el-input
              v-model="queryParams.caseModule"
              placeholder="请输入用例所属模块"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="创建时间" style="width: 308px">
            <el-date-picker
              v-model="dateRange"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5" :xs="8">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5" :xs="8">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5" :xs="8">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5" :xs="8">
            <el-button type="info" plain icon="Upload" @click="handleImport"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5" :xs="8">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              disabled
              >导出</el-button
            >
          </el-col>
          <el-col :span="1.5" :xs="8">
            <el-button
              type="success"
              plain
              icon="Position"
              :disabled="single"
              @click="handleExecute"
              >执行测试</el-button
            >
          </el-col>
          <!-- 环境变量显示 -->
          <el-col :span="1.5" :offset="1" :xs="24">
            <Tag color="success" :bordered="false">
              <Select
                v-model:value="currentEnv.envUrl"
                :options="currentEnv.envOptions"
                placeholder="当前未设置环境变量"
                notFoundContent="未添加任何环境变量"
                :bordered="false"
                :field-names="{
                  label: 'envUrl',
                  value: 'id',
                }"
                @change="handleChangeEnv"
              >
              </Select>
              <template #icon>
                <sync-outlined :spin="true" />
              </template>
            </Tag>
          </el-col>
          <right-toolbar
            v-model:showSearch="showSearch"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="caseList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="id" align="center" prop="id" />
          <el-table-column
            label="用例编号"
            align="center"
            :key="columns[0].key"
            prop="caseNo"
            v-if="columns[0].visible"
          />
          <el-table-column
            label="用例标题"
            align="center"
            :key="columns[1].key"
            prop="caseTitle"
            v-if="columns[1].visible"
            :show-overflow-tooltip="false"
          />
          <el-table-column
            label="用例说明"
            align="center"
            :key="columns[2].key"
            prop="caseDescription"
            v-if="columns[2].visible"
            :show-overflow-tooltip="false"
            :formatter="tableDefaultFormatter"
          />
          <el-table-column
            label="所属模块"
            align="center"
            :key="columns[3].key"
            prop="caseModule"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="所属子模块"
            align="center"
            :key="columns[4].key"
            prop="caseSubModule"
            v-if="columns[4].visible"
            :formatter="tableDefaultFormatter"
          />
          <el-table-column
            label="是否执行"
            align="center"
            :key="columns[5].key"
            v-if="columns[5].visible"
          >
            <template #default="scope">
              <!-- <el-switch
                v-model="scope.row.caseIsExecute"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(scope.row)"
              ></el-switch> -->
              <span>{{ scope.row.caseIsExecute === 1 ? "是" : "否" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="api路径地址"
            align="center"
            :key="columns[6].key"
            prop="apiPath"
            v-if="columns[6].visible"
          />
          <el-table-column
            label="api请求方法"
            align="center"
            :key="columns[7].key"
            prop="apiMethod"
            v-if="columns[7].visible"
          />
          <el-table-column
            label="请求头"
            align="center"
            :key="columns[8].key"
            prop="requestHeaders"
            v-if="columns[8].visible"
            :formatter="tableDefaultFormatter"
          />
          <el-table-column
            label="请求参数类型"
            align="center"
            :key="columns[9].key"
            prop="requestParamType"
            v-if="columns[9].visible"
          />
          <el-table-column
            label="请求参数"
            align="center"
            :key="columns[10].key"
            prop="requestParam"
            v-if="columns[10].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="预期状态码"
            align="center"
            :key="columns[11].key"
            prop="expectCode"
            v-if="columns[11].visible"
          />
          <el-table-column
            label="预期结果"
            align="center"
            :key="columns[12].key"
            prop="expectResult"
            v-if="columns[12].visible"
            :formatter="tableDefaultFormatter"
          />
          <el-table-column
            label="预期返回数据"
            align="center"
            :key="columns[13].key"
            prop="expectData"
            v-if="columns[13].visible"
            :formatter="tableDefaultFormatter"
          />
          <el-table-column
            label="是否保存请求体至redis"
            align="center"
            :key="columns[14].key"
            prop="requestToRedis"
            v-if="columns[14].visible"
          >
            <template #default="scope">
              <span>{{ scope.row.requestToRedis === 1 ? "是" : "否" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否保存响应体至redis"
            align="center"
            :key="columns[15].key"
            prop="responseToRedis"
            v-if="columns[15].visible"
            ><template #default="scope">
              <span>{{ scope.row.responseToRedis === 1 ? "是" : "否" }}</span>
            </template></el-table-column
          >
          <el-table-column
            label="编写者"
            align="center"
            :key="columns[16].key"
            prop="caseEditor"
            v-if="columns[16].visible"
            :formatter="tableDefaultFormatter"
          />
          <el-table-column
            label="备注"
            align="center"
            :key="columns[17].key"
            prop="remark"
            v-if="columns[17].visible"
            :formatter="tableDefaultFormatter"
          />
          <el-table-column
            label="创建时间"
            align="center"
            :key="columns[18].key"
            prop="createdAt"
            v-if="columns[18].visible"
            width="160"
          >
            <template #default="scope">
              <span>{{ parseTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-row :gutter="8">
                <el-col :span="6" :xs="12">
                  <el-tooltip content="执行用例" placement="top">
                    <el-button
                      link
                      type="primary"
                      icon="Position"
                      :loading="scope.row.loading"
                      @click="handleExecute(scope.row)"
                    >
                    </el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="6" :xs="12">
                  <el-tooltip content="详情" placement="top">
                    <el-button
                      link
                      type="primary"
                      icon="More"
                      @click="handleCaseInfo(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="6" :xs="12">
                  <el-tooltip content="修改" placement="top">
                    <el-button
                      link
                      type="primary"
                      icon="Edit"
                      @click="handleUpdate(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="6" :xs="12">
                  <el-tooltip content="删除" placement="top">
                    <el-button
                      link
                      type="primary"
                      icon="Delete"
                      @click="handleDelete(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="title"
      v-model="open"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="caseRef" label-position="top">
        <el-row gutter="20">
          <el-col :span="12" :xs="24">
            <el-form-item label="用例编号" prop="caseNo">
              <el-input
                v-model="form.caseNo"
                placeholder="请输入用例编号"
                maxlength="10"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="用例标题" prop="caseTitle">
              <el-input
                v-model="form.caseTitle"
                placeholder="请输入用例标题"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col :span="12" :xs="24">
            <el-form-item label="接口地址" prop="apiPath">
              <el-input v-model="form.apiPath" placeholder="请输入接口地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="所属模块" prop="caseModule">
              <el-input
                v-model="form.caseModule"
                placeholder="请输入用例所属模块"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :xs="24">
            <el-form-item label="所属子模块" prop="caseSubModule">
              <el-input
                v-model="form.caseSubModule"
                placeholder="请输入用例所属子模块"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="请求参数" prop="requestParam">
              <el-input
                v-model="form.requestParam"
                type="textarea"
                placeholder="请输入请求参数"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col :span="12" :xs="24">
            <el-form-item label="请求参数类型" prop="requestParamType">
              <el-select v-model="form.requestParamType" placeholder="请选择">
                <el-option label="BODY" value="body"></el-option>
                <el-option label="QUERY" value="query"></el-option>
                <el-option label="PATH" value="path"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="请求方法" prop="apiMethod">
              <el-select v-model="form.apiMethod" placeholder="请选择">
                <el-option label="GET" value="get"></el-option>
                <el-option label="POST" value="post"></el-option>
                <el-option label="PUT" value="put"></el-option>
                <el-option label="UPDATE" value="update"></el-option>
                <el-option label="DELETE" value="delete"></el-option>
                <el-option label="OPTIONS" value="options"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col :span="12" :xs="24">
            <el-form-item label="请求头" prop="requestHeaders">
              <el-input
                v-model="form.requestHeaders"
                placeholder="请输入请求头"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="预期网络状态码" prop="expectCode">
              <el-input
                v-model="form.expectCode"
                placeholder="请输入预期网络状态码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col :span="12" :xs="24">
            <el-form-item label="预期结果" prop="expectResult">
              <el-input
                v-model="form.expectResult"
                placeholder="请输入预期结果"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预期返回数据" prop="expectData">
              <el-input
                v-model="form.expectData"
                type="textarea"
                placeholder="请输入预期返回数据"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row gutter="20">
          <el-col :span="8" :xs="24">
            <el-form-item label="是否执行" prop="caseIsExecute">
              <el-radio-group v-model="form.caseIsExecute">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="24">
            <el-form-item label="是否保存请求体到redis" prop="requestToRedis">
              <el-radio-group v-model="form.requestToRedis">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="24">
            <el-form-item label="是否保存响应体到redis" prop="responseToRedis">
              <el-radio-group v-model="form.responseToRedis">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col :span="24">
            <el-form-item label="用例说明" prop="caseDescription">
              <el-input
                v-model="form.caseDescription"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="用例编写者">
              <el-input
                v-model="form.caseDescription"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox
                v-model="upload.updateSupport"
              />是否更新已经存在的数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link
              type="primary"
              :underline="false"
              style="font-size: 12px; vertical-align: baseline"
              @click="importTemplate"
              >下载模板</el-link
            >
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 测试结果展示框 -->
    <el-dialog :title="execute.title" v-model="execute.open" append-to-body>
      <el-result :icon="execute.resultIcon" :sub-title="execute.resultSubTitle">
        <template #extra>
          <el-descriptions direction="vertical" :column="2" border>
            <el-descriptions-item label="响应状态码">
              <el-tag
                :type="execute.resultStatusCode === 200 ? 'success' : 'danger'"
                >{{
                  execute.resultStatusCode ? execute.resultStatusCode : "-"
                }}</el-tag
              >
            </el-descriptions-item>
            <el-descriptions-item label="响应时间">
              <i>{{
                execute.resultResponseTime ? execute.resultResponseTime : "-"
              }}</i>
              ms
            </el-descriptions-item>
            <el-descriptions-item label="响应头" :span="2">
              <vue-json-pretty :data="execute.resultHeaders" showLineNumber />
            </el-descriptions-item>
            <el-descriptions-item label="响应体" :span="2">
              <vue-json-pretty :data="execute.resultContent" showLineNumber />
            </el-descriptions-item>
          </el-descriptions>
        </template>
        <template #title>
          <p :style="execute.resultTitleStyle">{{ execute.resultTitle }}</p>
        </template>
      </el-result>
    </el-dialog>
  </div>
</template>

<script setup name="Case">
import VueJsonPretty from "vue-json-pretty";
import { Select, Tag } from "ant-design-vue";
import { SyncOutlined } from "@ant-design/icons-vue";
import "vue-json-pretty/lib/styles.css";
import { getToken } from "@/utils/auth";
import { tableDefaultFormatter } from "@/utils/ruoyi";
import {
  listCase,
  addCase,
  getCase,
  deleteCase,
  updateCase,
  executeCase,
} from "@/api/test/case";
import { getCurrentEnv, setCurrentEnv, listEnv } from "@/api/test/env";

import { reactive } from "vue";

const router = useRouter();
const { proxy } = getCurrentInstance();

const caseList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const paramOptions = ref(undefined);
/*** 用例导入参数 */
const upload = reactive({
  // 是否显示弹出层（用例导入）
  open: false,
  // 弹出层标题（用例导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/testcase/import",
});

/**当前环境显示 */
const currentEnv = reactive({
  // 环境变量地址
  envUrl: undefined,
  // env列表选项
  envOptions: undefined,
});

/**执行用例参数 */
const execute = reactive({
  // 是否显示执行结果弹出框
  open: false,
  // 弹出层标题
  title: "测试结果",
  // 测试结果icon
  resultIcon: undefined,
  // 测试结果标题
  resultTitle: undefined,
  // 标题样式
  resultTitleStyle: {},
  // 测试结果子标题
  resultSubTitle: undefined,
  // 测试结果响应状态码
  resultStatusCode: undefined,
  // 响应时间
  resultResponseTime: undefined,
  // 测试结果响应头
  resultHeaders: undefined,
  // 测试结果响应体
  resultContent: undefined,
});
// 列显隐信息
const columns = ref([
  { key: 0, label: `用例编号`, visible: true },
  { key: 1, label: `用例标题`, visible: true },
  { key: 2, label: `用例说明`, visible: true },
  { key: 3, label: `所属模块`, visible: true },
  { key: 4, label: `所属子模块`, visible: false },
  { key: 5, label: `是否执行`, visible: true },
  { key: 6, label: `api路径地址`, visible: true },
  { key: 7, label: `api请求方法`, visible: true },
  { key: 8, label: `请求头`, visible: true },
  { key: 9, label: `请求参数类型`, visible: true },
  { key: 10, label: `请求参数`, visible: true },
  { key: 11, label: `预期状态码`, visible: true },
  { key: 12, label: `预期结果`, visible: false },
  { key: 13, label: `预期返回数据`, visible: false },
  { key: 14, label: `是否保存请求体至redis`, visible: true },
  { key: 15, label: `是否保存响应体至redis`, visible: true },
  { key: 16, label: `编写者`, visible: true },
  { key: 17, label: `备注`, visible: true },
  { key: 18, label: `创建时间`, visible: true },
]);

const data = reactive({
  form: {},
  queryParams: {
    page: 1,
    limit: 10,
    caseTitle: undefined,
    caseSuite: undefined,
    caseModule: undefined,
  },
  rules: {
    caseNo: [
      { required: true, message: "用例编号不能为空", trigger: "blur" },
      {
        max: 10,
        message: "用例编号长度必须小于10",
        trigger: "blur",
      },
    ],
    caseTitle: [
      { required: true, message: "用例标题不能为空", trigger: "blur" },
      {
        max: 50,
        message: "用例标题长度必须小于50",
        trigger: "blur",
      },
    ],
    caseModule: [
      { required: true, message: "用例所属模块不能为空", trigger: "blur" },
      {
        max: 20,
        message: "用例所属模块长度必须小于20",
        trigger: "blur",
      },
    ],
    apiPath: [
      { required: true, message: "用例接口地址不能为空", trigger: "blur" },
    ],
    requestParam: [
      { required: true, message: "用例接口请求参数不能为空", trigger: "blur" },
    ],
    expectCode: [
      {
        required: true,
        message: "用例预期网络状态码不能为空",
        trigger: "blur",
      },
    ],
    apiMethod: [
      {
        required: true,
        message: "api方法不能为空",
        trigger: "blur",
      },
    ],
    requestParamType: [
      {
        required: true,
        message: "请求参数类型不能为空",
        trigger: "blur",
      },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);
/**获取当前环境变量 */
async function queryCurrentEnv() {
  const env = await getCurrentEnv();
  currentEnv.envUrl = env.result;
}
/**设置当前环境变量 */
async function handleChangeEnv(command) {
  const envId = command;
  const res = await setCurrentEnv(envId);
  proxy.$modal.msgSuccess("设置成功");
  currentEnv.envUrl = res.result;
}

/** 查询用例列表 */
async function getList() {
  loading.value = true;
  const res = await listCase(
    proxy.addDateRange(queryParams.value, dateRange.value)
  );
  // 获取当前环境
  await queryCurrentEnv();
  // 获取env list
  const envRes = await listEnv();
  currentEnv.envOptions = envRes.result.data;
  loading.value = false;
  // 添加loading字段颗粒化row的loading
  caseList.value = res.result.data.map((item) => ({ ...item, loading: false }));
  console.log(caseList.value);
  total.value = res.result.total;
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  // queryParams.value.deptId = undefined;
  // proxy.$refs.deptTreeRef.setCurrentKey(null);
  handleQuery();
}
/** 删除按钮操作 */
function handleDelete(row) {
  const caseIds = row.id ? [row.id] : ids.value;
  proxy.$modal
    .confirm('是否确认删除用户编号为"' + caseIds + '"的数据项？')
    .then(function () {
      return deleteCase(caseIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}
/**充值测试结果数据 */
function resetTestResult() {
  execute.resultTitle = undefined;
  execute.resultSubTitle = undefined;
  execute.resultStatusCode = undefined;
  execute.resultResponseTime = undefined;
  execute.resultHeaders = undefined;
  execute.resultContent = undefined;
}

/** 执行测试按钮操作 */
async function handleExecute(row) {
  resetTestResult();
  const caseIds = row.id || ids.value[0];
  row.loading = true;
  try {
    // 测试通过
    const res = await executeCase(caseIds);
    console.log(res);
    execute.resultTitleStyle = { color: "green", fontSize: "25px" };
    execute.open = true;
    execute.resultIcon = "success";
    execute.resultTitle = "passed";
    execute.resultStatusCode = res.result.code;
    execute.resultResponseTime = res.result.time;
    execute.resultHeaders = res.result.headers;
    execute.resultContent = res.result.body;
  } catch (error) {
    // 测试失败
    execute.resultTitleStyle = { color: "red", fontSize: "25px" };
    console.log(error);
    if (error.code === "ECONNABORTED") {
      // 请求超时处理
      console.log("请求超时");
    } else {
      // 其他错误处理
      execute.open = true;
      execute.resultIcon = "error";
      execute.resultTitle = "failed";
      execute.resultSubTitle = error.response.data.message;
      if (error.response.status === 504) {
        console.log("网关超时");
      } else if (error.response.status === 417) {
        execute.resultStatusCode = error.response.data.result.code;
        execute.resultHeaders = error.response.data.result.headers;
        execute.resultContent = error.response.data.result.body;
        execute.resultResponseTime = error.response.data.result.time;
        console.log(error);
      } else {
        proxy.$modal.alertError("测试失败，未知错误");
      }
    }
  } finally {
    row.loading = false;
  }
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "/testcase/export",
    {
      ...queryParams.value,
    },
    `testcase_${new Date().getTime()}.xlsx`
  );
}
/** 执行状态修改  */
function handleStatusChange(row) {
  console.log(row);
  let text = row.caseIsExecute === 1 ? "启用" : "停用";
  proxy.$modal
    .confirm('确认要"' + text + '""' + row.caseTitle + '"用例吗?')
    .then(function () {
      // return changeUserStatus(row.id, row.status);
    })
    .then(() => {
      proxy.$modal.msgSuccess(text + "成功");
    })
    .catch(function () {
      row.caseIsExecute = row.caseIsExecute === 0 ? 1 : 0;
    });
}
/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case "handleResetPwd":
      handleResetPwd(row);
      break;
    case "handleAuthRole":
      handleAuthRole(row);
      break;
    default:
      break;
  }
}
/** 跳转用例详情 */
function handleCaseInfo(row) {
  const caseId = row.id;
  router.push({ name: "CaseInfo", params: { caseId: caseId } });
}

/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 导入按钮操作 */
function handleImport() {
  upload.title = "用例导入";
  upload.open = true;
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "/testcase/template/download",
    {},
    `testcase_template_${new Date().getTime()}.xlsx`
  );
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
      response.message +
      "</div>",
    "导入结果",
    { dangerouslyUseHTMLString: true }
  );
  getList();
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}
/** 重置操作表单 */
function reset() {
  form.value = {
    caseNo: undefined,
    caseTitle: undefined,
    caseModule: undefined,
    caseDescription: undefined,
    caseSubModule: undefined,
    caseIsExecute: 1,
    apiPath: undefined,
    apiMethod: undefined,
    requestHeaders: undefined,
    requestParamType: undefined,
    requestParam: undefined,
    expectCode: undefined,
    expectResult: undefined,
    expectData: undefined,
    requestToRedis: 0,
    responseToRedis: 0,
    remark: undefined,
  };
  proxy.resetForm("caseRef");
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 新增按钮操作 */
async function handleAdd() {
  reset();
  // const res = await addCase()
  open.value = true;
  title.value = "添加用例";
}
/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  const caseId = row.id || ids.value;
  const res = await getCase(caseId);
  form.value = res.result;
  open.value = true;
  title.value = "修改用例";
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["caseRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateCase(form.value.id, form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCase(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

// getDeptTree();
getList();
</script>
<style lang="scss" scoped>
.el-result {
  padding-top: 0;
  :deep(.el-result__extra) {
    width: 100%;
  }
  :deep(.el-result__subtitle) {
    p {
      color: red;
    }
  }
}
</style>