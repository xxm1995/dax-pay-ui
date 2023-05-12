<template>
  <a-drawer
    forceRender
    title="任务执行日志"
    :visible="visible"
    :maskClosable="true"
    width="60%"
    placement="right"
    :closable="true"
    @close="visible = false"
  >
    <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
    <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
      <vxe-column type="seq" width="60" />
      <vxe-column field="handlerName" title="处理器名称" />
      <vxe-column field="className" title="处理器全限定名" />
      <vxe-column field="success" title="是否执行成功">
        <template #default="{ row }">
          <a-tag v-if="row.success" color="green">成功</a-tag>
          <a-tag v-else color="red">失败</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="errorMessage" title="错误信息" />
      <vxe-column field="startTime" title="开始时间" />
      <vxe-column field="endTime" title="结束时间" />
      <vxe-column field="duration" title="执行时长(毫秒)" />
      <vxe-column field="createTime" title="创建时间" />
    </vxe-table>
    <vxe-pager
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"
    />
  </a-drawer>
</template>

<script lang="ts" setup>
  import { nextTick } from 'vue'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { del, page } from './QuartzJobLog.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { QuartzJob } from './QuartzJob.api'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage } = useMessage()

  // 查询条件
  const fields = [
    {
      name: '执行状态',
      placeholder: '请选择状态',
      field: 'success',
      type: 'list',
      md: 12,
      selectList: [
        { label: '成功', value: 'true' },
        { label: '失败', value: 'false' },
      ],
    },
  ] as QueryField[]
  let job: QuartzJob
  let visible = $ref(false)
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()

  nextTick(() => {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  })

  function init(quartzJob) {
    job = quartzJob
    visible = true
    queryPage()
  }

  // 分页查询
  function queryPage() {
    loading.value = true
    page({
      className: job.jobClassName,
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }

  // 删除
  function remove(record) {
    del(record.id).then(() => {
      createMessage.success('删除成功')
    })
    queryPage()
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
