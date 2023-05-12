<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom zoom :refresh="{ queryMethod: queryPage }" />
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
            <a-link href="javascript:" @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link danger :disabled="row.state !== 'running'" @click="closeInstance(row)">取消</a-link>
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
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { onMounted } from 'vue'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { close, Instance, pageAdmin } from '/@/views/modules/bpm/instance/Instance.api'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'

  const { handleTableChange, resetQueryParams, pageQueryResHandel, pagination, pages, model, loading } = useTablePage(queryPage)
  const { dictConvert } = useDict()
  const { createMessage, createConfirm } = useMessage()

  // 查询条件
  const fields = [
    { field: 'code', type: STRING, name: '流程编号', placeholder: '请输入流程编号' },
    { field: 'name', type: STRING, name: '流程名称', placeholder: '请输入流程名称' },
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
    pageAdmin({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }
  /**
   * 查看详情
   */
  function show(record) {

  }
  /**
   * 作废流程
   */
  function closeInstance(record: Instance) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否取消此流程',
      onOk: () => {
        loading.value = true
        close(record.instanceId).then(() => {
          queryPage()
        })
      },
    })
  }
</script>

<style scoped></style>
