<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom zoom :refresh="{ queryMethod: queryPage }" />
      <vxe-table ref="xTable" row-id="id" :loading="loading" :data="pagination.records">
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="instanceName" title="业务标题" />
        <vxe-column field="defName" title="流程名称" />
        <vxe-column field="nodeName" title="环节" />
        <vxe-column field="taskId" title="任务id" />
        <vxe-column field="instanceId" title="流程id" />
        <vxe-column field="startUserName" title="发起人" />
        <vxe-column field="startTime" title="任务开始时间" />
        <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a href="javascript:" @click="handle(row)">办理</a>
            <!--          <a-divider type="vertical"/>-->
            <!--          <a href="javascript:" @click="reject(row)">驳回</a>-->
            <a-divider type="vertical" />
            <a href="javascript:" @click="assignee(row)">委派</a>
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
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { onMounted } from 'vue'
  import { pageMyTodo } from "/@/views/modules/bpm/task/Task.api";

  const { handleTableChange, resetQueryParams, pageQueryResHandel, pagination, pages, model, loading } = useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()

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
    pageMyTodo({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
</script>

<style scoped></style>
