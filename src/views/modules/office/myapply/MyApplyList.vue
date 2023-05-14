<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom zoom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="modelShow">发起流程</a-button>
        </template>
      </vxe-toolbar>
      <vxe-table ref="xTable" row-id="id" :loading="loading" :data="pagination.records">
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="name" title="标题" />
        <vxe-column field="defMame" title="流程名称" />
        <vxe-column field="instanceId" title="实例ID" />
        <vxe-column field="startUserName" title="发起人" />
        <vxe-column field="state" title="状态">
          <template #default="{ row }">
            {{ dictConvert('BpmInstanceState', row.state) }}
          </template>
        </vxe-column>
        <vxe-column field="startTime" title="开始时间" />
        <vxe-column field="endTime" title="结束时间" />
        <vxe-column fixed="right" width="120" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a href="javascript:" @click="show(row)">查看</a>
            <a-divider type="vertical" />
            <a href="javascript:" :disabled="row.state !== 'running'" @click="close(row)">取消</a>
          </template>
        </vxe-column>
      </vxe-table>
      <vxe-pager
        border
        size="medium"
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { $ref } from 'vue/macros'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { onMounted } from 'vue'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { pageMyApply } from '/@/views/modules/bpm/instance/Instance.api'

  const { handleTableChange, resetQueryParams, pageQueryResHandel, pagination, pages, model, loading } = useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  // 查询条件
  const fields = [
    { field: 'code', type: STRING, name: '流程编号', placeholder: '请输入流程编号' },
    { field: 'code', type: STRING, name: '流程名称', placeholder: '请输入流程名称' },
  ] as QueryField[]
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  function queryPage() {
    loading.value = true
    pageMyApply({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
  // 创建流程时的弹窗
  function modelShow() {}
</script>

<style scoped></style>
