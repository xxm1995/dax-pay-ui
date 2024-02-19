<template>
  <basic-drawer forceRender v-bind="$attrs" title="储值卡记录" width="60%" :visible="visible" @close="visible = false">
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
      <vxe-column field="type" title="本地订单ID" min-width="170">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('VoucherRecordType', row.type) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="amount" title="金额" />
      <vxe-column field="orderId" title="订单号" />
      <vxe-column field="remark" title="备注" />
      <vxe-column field="createTime" title="创建时间" sortable />
      <vxe-column fixed="right" width="50" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <a-link @click="show(row)">查看</a-link>
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
    <voucher-record-info ref="voucherRecordInfo" />
  </basic-drawer>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page } from './VoucherRecord.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useDict } from '/@/hooks/bootx/useDict'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { Voucher } from '../manager/Voucher.api'
  import ALink from '/@/components/Link/Link.vue'
  import VoucherRecordInfo from './VoucherRecordInfo.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, sortChange, sortParam, pages, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let visible = $ref<boolean>(false)
  let voucher = $ref<Voucher>({})
  let voucherRecordInfo = $ref<any>()

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
  function init(record: Voucher) {
    visible = true
    voucher = record
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
      voucherId: voucher.id,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }

  /**
   * 查看详情
   */
  function show(record) {
    voucherRecordInfo.init(record)
  }

  defineExpose({ init })
</script>

<style scoped lang="less"></style>
