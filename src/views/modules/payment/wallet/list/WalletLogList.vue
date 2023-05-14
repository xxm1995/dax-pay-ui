<template>
  <basic-drawer forceRender showFooter v-bind="$attrs" title="钱包日志列表" width="60%" :visible="visible" @close="visible = false">
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
    <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="type" title="类型">
        <template #default="{ row }">
          {{ dictConvert('WalletLogType', row.type) }}
        </template>
      </vxe-column>
      <vxe-column field="amount" title="金额" />
      <vxe-column field="operationSource" title="操作类型">
        <template #default="{ row }">
          {{ dictConvert('WalletLogOperation', row.operationSource) }}
        </template>
      </vxe-column>
      <vxe-column field="remark" title="备注" />
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

<script lang="ts" setup>
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { $ref } from 'vue/macros'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { nextTick } from 'vue'
  import { pageByWalletId } from '/@/views/modules/payment/wallet/list/WalletLog.api'
  import { useDict } from '/@/hooks/bootx/useDict'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage } = useMessage()
  const { dictConvert } = useDict()

  // 查询条件
  const fields = [] as QueryField[]
  let visible = $ref(false)
  let walletId = $ref<string>()

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()

  nextTick(() => {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  })

  function init(id) {
    visible = true
    walletId = id
    queryPage()
  }
  // 分页查询
  function queryPage() {
    pageByWalletId({
      ...model.queryParam,
      ...pages,
      walletId,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
  defineExpose({ init })
</script>

<style scoped></style>
