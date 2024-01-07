<template>
  <basic-drawer forceRender showFooter v-bind="$attrs" title="储值卡日志" width="60%" :visible="visible" @close="visible = false">
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
    <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="type" title="类型">
        <template #default="{ row }">
          {{ dictConvert('VoucherLogType', row.type) }}
        </template>
      </vxe-column>
      <vxe-column field="amount" title="金额" />
      <vxe-column field="createTime" title="操作时间" />
      <vxe-column field="remark" title="备注" />
      <template #footer>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
      </template>
    </vxe-table>
    <vxe-pager
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"
    />
  </basic-drawer>
</template>

<script setup lang="ts">
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { VxeTableInstance, VxeToolbarInstance, VxeTable, VxeColumn, VxePager, VxeToolbar } from 'vxe-table'
  import { nextTick } from 'vue'
  import { pageByVoucherId } from './VoucherLog.api'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage } = useMessage()
  const { dictConvert } = useDict()

  // 查询条件
  const fields = [] as QueryField[]
  let visible = $ref(false)
  let voucherId = $ref<string>()

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()

  nextTick(() => {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  })

  /**
   * 初始化
   */
  function init(id) {
    visible = true
    voucherId = id
    queryPage()
  }
  /**
   * 分页查询
   */
  function queryPage() {
    pageByVoucherId({
      ...model.queryParam,
      ...pages,
      voucherId,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
  /**
   * 关闭
   */
  function handleCancel() {
    visible = false
  }
  defineExpose({ init })
</script>

<style scoped lang="less"></style>
