<template>
  <basic-drawer forceRender v-bind="$attrs" title="通道订单列表" width="60%" :visible="visible" @close="visible = false">
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
    <vxe-table
      row-id="id"
      ref="xTable"
      :data="pagination.records"
      :loading="loading"
      :sort-config="{ remote: true, trigger: 'cell' }"
      @sort-change="sortChange"
    >
      <vxe-column type="seq" width="60" />
      <vxe-column field="reqCount" title="请求次数" />
      <vxe-column field="channel" title="是否成功">
        <template #default="{ row }">
          <a-tag v-if="row.success" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="type" title="发送类型">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('ClientNoticeSendType', row.type) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="errorMsg" title="错误信息" max-width="200" />
      <vxe-column field="createTime" title="发送时间" />
      <vxe-column fixed="right" width="60" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
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
    <client-notice-record-info ref="clientNoticeRecordInfo" />
  </basic-drawer>
</template>

<script setup lang="ts">
  import { nextTick } from 'vue'
  import { $ref } from 'vue/macros'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxePager, VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { pageRecord, ClientNoticeTask } from './ClientNoticeTask.api'
  import ClientNoticeRecordInfo from './ClientNoticeRecordInfo.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, sortChange, resetQueryParams, pagination, pages, sortParam, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage } = useMessage()
  const { dictDropDown, dictConvert } = useDict()

  let visible = $ref(false)
  let task = $ref<ClientNoticeTask>({})
  let clientNoticeRecordInfo = $ref<any>()
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()

  nextTick(() => {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  })

  /**
   * 入口
   */
  function init(record: ClientNoticeTask) {
    visible = true
    task = record
    queryPage()
  }

  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    pageRecord({
      taskId: task.id,
      ...sortParam,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
  /**
   * 查看
   */
  function show(record) {
    clientNoticeRecordInfo.init(record)
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
