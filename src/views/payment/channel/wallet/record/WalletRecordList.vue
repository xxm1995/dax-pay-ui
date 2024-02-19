<template>
  <basic-drawer forceRender v-bind="$attrs" title="钱包记录" width="60%" :visible="visible" @close="visible = false">
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
    <vxe-table
      row-id="id"
      ref="xTable"
      :data="pagination.records"
      :loading="loading"
      :sort-config="{ remote: true, trigger: 'cell' }"
      @sort-change="sortChange"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="orderId" title="订单号" />
      <vxe-column field="type" title="类型">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('WalletRecordType', row.type) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="amount" title="金额" />
      <vxe-column field="remark" title="备注" />
      <vxe-column field="createTime" title="记录时间" sortable />
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
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page, WalletRecord } from './WalletRecord.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { Wallet } from '/@/views/payment/channel/wallet/manager/Wallet.api'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, sortChange, sortParam, pages, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let visible = $ref<boolean>(false)
  let wallet = $ref<Wallet>({})

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()

  onMounted(() => {
    vxeBind()
  })

  /**
   * 绑定
   */
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化
   */
  function init(record: Wallet) {
    visible = true
    wallet = record
    queryPage()
  }

  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
      ...sortParam,
      walletId: wallet.id,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }
  defineExpose({ init })
</script>

<style scoped lang="less"></style>
