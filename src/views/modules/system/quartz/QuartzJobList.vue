<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
            <a-button pre-icon="ant-design:sync-outlined" @click="sync">状态同步</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="name" title="任务名称" />
        <vxe-column field="jobClassName" title="任务类名" />
        <vxe-column field="cron" title="cron表达式" />
        <vxe-column field="parameter" title="参数" />
        <vxe-column field="state" title="状态">
          <template #default="{ row }">
            <a-tag v-if="row.state === 1" color="green">运行</a-tag>
            <a-tag v-else color="red">停用</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="210" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a href="javascript:" @click="show(row)">查看</a>
            </span>
            <a-divider type="vertical" />
            <span>
              <a href="javascript:" @click="edit(row)">编辑</a>
            </span>
            <a-divider type="vertical" />
            <a-popconfirm title="是否删除" @confirm="remove(row)" okText="是" cancelText="否">
              <a href="javascript:" style="color: red">删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /> </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:" @click="logPage(row)">执行日志</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:" @click="executeJob(row)">立即运行</a>
                  </a-menu-item>
                  <a-menu-item v-if="row.state === 0">
                    <a href="javascript:" @click="startJob(row)">启动</a>
                  </a-menu-item>
                  <a-menu-item v-if="row.state === 1">
                    <a href="javascript:" @click="stopJob(row)" style="color: red">停止</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </vxe-column>
      </vxe-table>
      <vxe-pager
        size="medium"
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
      <quartz-job-log-list ref="quartzJobLogList" />
      <quartz-job-edit ref="quartzJobEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { del, execute, page, start, stop, syncJobStatus } from './QuartzJob.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import QuartzJobEdit from './QuartzJobEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import QuartzJobLogList from './QuartzJobLogList.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  // 查询条件
  const fields = [
    { field: 'jobClassName', type: 'string', name: '任务类名', placeholder: '请输入任务类名' },
    {
      field: 'status',
      type: 'list',
      name: '任务状态',
      placeholder: '请选择状态',
      md: 5,
      selectList: [
        { label: '全部', value: '' },
        { label: '正常', value: '1' },
        { label: '停止', value: '0' },
      ],
    },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const quartzJobEdit = $ref<any>()
  const quartzJobLogList = $ref<any>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  // 分页查询
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }
  // 新增
  function add() {
    quartzJobEdit.init(null, FormEditType.Add)
  }
  // 查看
  function edit(record) {
    quartzJobEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    quartzJobEdit.init(record.id, FormEditType.Show)
  }
  // 查看执行日志
  function logPage(record) {
    quartzJobLogList.init(record)
  }

  // 删除
  function remove(record) {
    del(record.id).then(() => {
      createMessage.success('删除成功')
      queryPage()
    })
  }
  // 开始
  function startJob(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否开始该定时任务',
      onOk: () => {
        start(record.id).then(() => {
          createMessage.success('启动成功')
          queryPage()
        })
      },
    })
  }
  // 停止
  function stopJob(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否停止该定时任务',
      onOk: () => {
        stop(record.id).then(() => {
          createMessage.success('停止成功')
          queryPage()
        })
      },
    })
  }
  // 立即执行
  function executeJob(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否立即运行该定时任务',
      onOk: () => {
        execute(record.id).then(() => {
          createMessage.success('运行成功')
        })
      },
    })
  }

  // 同步任务状态
  function sync() {
    syncJobStatus().then(() => {
      queryPage()
      createMessage.success('任务状态同步成功')
    })
  }
</script>

<style lang="less" scoped></style>
