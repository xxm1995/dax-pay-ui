<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="paymentId" title="支付记录单号">
          <template #default="{ row }">
            <a @click="showPayment(row.paymentId)">
              {{ row.paymentId }}
            </a>
          </template>
        </vxe-column>
        <vxe-column field="businessId" title="原业务ID" />
        <vxe-column field="title" title="原支付标题" />
        <vxe-column field="amount" title="退款金额" />
        <vxe-column field="refundableBalance" title="剩余可退金额" />
        <vxe-column field="refundTime" title="退款时间" />
        <vxe-column field="refundStatus" title="状态">
          <template #default="{ row }">
            <a-tag>{{ row.refundStatus ? '成功' : '失败' }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column fixed="right" width="60" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a-link @click="show(row)">查看</a-link>
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
      <refund-record-edit ref="refundRecordEdit" @ok="queryPage" />
      <payment-info ref="paymentInfo" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page } from './RefundRecord.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import RefundRecordEdit from './RefundRecordInfo.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import PaymentInfo from '/@/views/modules/payment/order/payment/PaymentInfo.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  // 查询条件
  const fields = [
    { field: 'paymentId', type: STRING, name: '支付单号', placeholder: '请输入支付单号' },
    { field: 'businessId', type: STRING, name: '业务ID', placeholder: '请输入业务ID' },
    { field: 'title', type: STRING, name: '标题', placeholder: '请输入标题' },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const refundRecordEdit = $ref<any>()
  const paymentInfo = $ref<any>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  // 分页查询
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }
  // 查看
  function show(record) {
    refundRecordEdit.init(record.id, FormEditType.Show)
  }

  function showPayment(paymentId) {
    paymentInfo.init(paymentId, 'show')
  }
</script>

<style lang="less" scoped></style>
