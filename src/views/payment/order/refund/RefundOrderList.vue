<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :query-params="model.queryParam"
        :fields="fields"
        @query="queryPage"
        @reset="resetQueryParams"
        :sort-config="{ remote: true, trigger: 'cell' }"
        @sort-change="sortChange"
      />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
      <vxe-table
        row-id="id"
        ref="xTable"
        :sort-config="{ remote: true, trigger: 'cell' }"
        :data="pagination.records"
        :loading="loading"
        @sort-change="sortChange"
      >
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="id" title="退款ID" width="180" />
        <vxe-column field="title" title="原支付标题" />
        <vxe-column field="paymentId" title="原支付ID" width="170">
          <template #default="{ row }">
            <a @click="showPayment(row.paymentId)">
              {{ row.paymentId }}
            </a>
          </template>
        </vxe-column>
        <vxe-column field="businessNo" title="原业务号" :visible="false" />
        <vxe-column field="amount" title="退款金额" sortable />
        <vxe-column field="refundableBalance" title="剩余可退金额" sortable />
        <vxe-column field="async" title="包含异步通道">
          <template #default="{ row }">
            <a-tag color="green">{{ row.asyncPay ? '是' : '否' }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="gatewayOrderNo" title="支付网关订单号" :visible="false" />
        <vxe-column field="refundTime" title="退款时间" sortable />
        <vxe-column field="refundStatus" title="状态">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('RefundStatus', row.status) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="reason" title="原因" />
        <vxe-column fixed="right" width="220" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link @click="showChannel(row)">通道订单</a-link>
            <a-divider type="vertical" />
            <!--      只有退款中的异步订单才可以同步      -->
            <a-divider type="vertical" />
            <a-link :disabled="!(row.asyncPay && row.status === 'progress')" @click="sync(row)">同步</a-link>
            <!--      只有退款失败的异步订单才可以重新退款      -->
            <a-link :disabled="!(row.asyncPay && row.status === 'fail')" @click="reset(row)">重试</a-link>
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
      <refund-order-info ref="refundOrderInfo" @ok="queryPage" />
      <refund-channel-order-list ref="refundChannelOrderList" />
      <pay-order-info ref="payOrderInfo" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page, resetRefund, syncById } from "./RefundOrder.api";
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import RefundOrderInfo from './RefundOrderInfo.vue'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import PayOrderInfo from '/@/views/payment/order/pay/PayOrderInfo.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import RefundChannelOrderList from '/@/views/payment/order/refund/RefundChannelOrderList.vue'
  import ALink from '/@/components/Link/Link.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, sortChange, sortParam, pagination, pages, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let payRefundStatusList = $ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'id', type: STRING, name: '退款ID', placeholder: '请输入完整退款ID' },
      { field: 'refundNo', type: STRING, name: '退款号', placeholder: '请输入完整退款号' },
      { field: 'paymentId', type: STRING, name: '原支付ID', placeholder: '请输入完整支付ID' },
      { field: 'businessNo', type: STRING, name: '原业务号', placeholder: '请输入业务号' },
      { field: 'gatewayOrderNo', type: STRING, name: '网关订单号', placeholder: '请输入完整网关订单号' },
      { field: 'title', type: STRING, name: '原支付标题', placeholder: '请输入原支付标题' },
      {
        field: 'status',
        type: LIST,
        name: '处理状态',
        placeholder: '请选择处理状态',
        selectList: payRefundStatusList,
      },
    ] as QueryField[]
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const refundOrderInfo = $ref<any>()
  const payOrderInfo = $ref<any>()
  const refundChannelOrderList = $ref<any>()

  onMounted(() => {
    initData()
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    payRefundStatusList = await dictDropDown('RefundStatus')
  }

  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...sortParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }

  /**
   * 退款信息同步
   */
  function sync(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否同步退款信息',
      onOk: () => {
        loading.value = true
        syncById(record.id).then(({ data }) => {
          // TODO 后期可以根据返回结果进行相应的处理
          createMessage.success('同步成功')
          console.log(data)
          queryPage()
        })
      },
    })
  }

  /**
   * 退款重试
   */
  function reset(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否同步退款信息',
      onOk: () => {
        loading.value = true
        resetRefund(record.id).then(() => {
          createMessage.success('提交成功')
          queryPage()
        })
      },
    })
  }

  /**
   * 查看
   */
  function show(record) {
    refundOrderInfo.init(record.id)
  }

  /**
   * 查看支付单信息
   * @param paymentId
   */
  function showPayment(paymentId) {
    payOrderInfo.init(paymentId)
  }

  /**
   * 查看通道明细列表
   */
  function showChannel(record) {
    refundChannelOrderList.init(record)
  }
</script>

<style lang="less" scoped></style>
