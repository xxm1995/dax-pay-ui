<template>
  <basic-drawer forceRender v-bind="$attrs" title="分账订单明细" width="60%" :visible="visible" @close="visible = false">
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
    <vxe-table row-id="id" ref="xTable" :data="records" :loading="loading" :cell-style="cellStyle">
      <vxe-column type="seq" width="60" />
      <vxe-column field="receiverName" title="接收方姓名" :min-width="100" />
      <vxe-column field="receiverType" title="接收方类型" :min-width="100">
        <template #default="{ row }">
          {{ dictConvert('AllocationReceiverType', row.receiverType) }}
        </template>
      </vxe-column>
      <vxe-column field="rate" title="分账比例" :min-width="100">
        <template #default="{ row }"> {{ row.rate / 100.0 }}% </template>
      </vxe-column>
      <vxe-column field="amount" title="分账金额" :min-width="100">
        <template #default="{ row }"> {{ row.amount / 100.0 }} 元 </template>
      </vxe-column>
      <vxe-column field="result" title="分账结果" :min-width="130">
        <template #default="{ row }"> {{ dictConvert('AllocationDetailResult', row.result) }} </template>
      </vxe-column>
      <vxe-column field="result" title="错误原因" :min-width="160">
        <template #default="{ row }"> {{ row.errorMsg }} </template>
      </vxe-column>
      <vxe-column field="result" title="完成时间" :min-width="160">
        <template #default="{ row }"> {{ row.finishTime }} </template>
      </vxe-column>
      <vxe-column fixed="right" :min-width="60" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
        </template>
      </vxe-column>
    </vxe-table>
    <allocation-order-detail-info ref="allocationOrderDetailInfo" />
  </basic-drawer>
</template>

<script setup lang="ts">
  import { nextTick } from 'vue'
  import { $ref } from 'vue/macros'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { AllocationOrder, AllocationOrderDetail, detailList } from './AllocationOrder.api'
  import AllocationOrderDetailInfo from './AllocationOrderDetailInfo.vue'
  // 使用hooks
  const { resetQueryParams, model, loading } = useTablePage(queryPage)
  const { notification, createMessage } = useMessage()
  const { dictDropDown, dictConvert } = useDict()

  let visible = $ref(false)
  let order = $ref<AllocationOrder>({})
  let records = $ref<AllocationOrderDetail[]>([])
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const allocationOrderDetailInfo = $ref<any>()

  nextTick(() => {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  })

  /**
   * 入口
   * @param record
   */
  function init(record) {
    visible = true
    order = record
    queryPage()
  }

  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    detailList(order.id).then(({ data }) => {
      records = data
      loading.value = false
    })
  }
  /**
   * 查看
   */
  function show(record) {
    allocationOrderDetailInfo.init(record)
  }

  function cellStyle({ row, column }) {
    if (column.field == 'status') {
      if (row.status == 'success') {
        return { color: 'green' }
      }
      if (row.status == 'fail') {
        return { color: 'red' }
      }
      if (row.status == 'progress') {
        return { color: 'orange' }
      }
      if (row.status == 'close') {
        return { color: 'gray' }
      }
      return { color: 'red' }
    }
    if (column.field == 'asyncPay') {
      if (row.asyncPay) {
        return { color: 'green' }
      } else {
        return { color: 'gray' }
      }
    }
    if (column.field == 'combinationPay') {
      if (row.combinationPay) {
        return { color: 'green' }
      } else {
        return { color: 'gray' }
      }
    }
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
