<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
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
        <vxe-column field="orderId" title="本地订单ID" width="170">
          <template #default="{ row }">
            <a @click="showOrder(row)">
              {{ row.orderId }}
            </a>
          </template>
        </vxe-column>
        <vxe-column field="payChannel" title="支付通道">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayChannel', row.payChannel) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="callbackType" title="回调类型">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayCallbackType', row.callbackType) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="status" title="处理状态">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayCallbackStatus', row.status) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="msg" title="提示信息" />
        <vxe-column field="createTime" title="通知时间" sortable />
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
      <pay-callback-record-info ref="payCallbackRecordInfo" />
      <pay-order-info ref="payOrderInfo" />
      <refund-order-info ref="refundOrderInfo" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page, PayCallbackRecord } from './PayCallbackRecord.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import PayCallbackRecordInfo from './PayCallbackRecordInfo.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import PayOrderInfo from '/@/views/payment/order/pay/PayOrderInfo.vue'
  import RefundOrderInfo from '/@/views/payment/order/refund/RefundOrderInfo.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, sortChange, sortParam, pages, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let asyncPayChannelList = $ref<LabeledValue[]>([])
  let PayCallbackStatusList = $ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'paymentId', type: STRING, name: '支付号', placeholder: '请输入完整支付号' },
      {
        field: 'payChannel',
        type: LIST,
        name: '支付通道',
        placeholder: '请选择支付通道',
        selectList: asyncPayChannelList,
      },
      {
        field: 'status',
        type: LIST,
        name: '处理状态',
        placeholder: '请选择消息处理状态',
        selectList: PayCallbackStatusList,
      },
    ] as QueryField[]
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const payCallbackRecordInfo = $ref<any>()
  const payOrderInfo = $ref<any>()
  const refundOrderInfo = $ref<any>()

  onMounted(() => {
    initData()
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化
   */
  async function initData() {
    asyncPayChannelList = await dictDropDown('AsyncPayChannel')
    PayCallbackStatusList = await dictDropDown('PayCallbackStatus')
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
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }
  /**
   * 查看
   */
  function show(record) {
    payCallbackRecordInfo.init(record.id)
  }

  /**
   * 查看订单单信息
   */
  function showOrder(record: PayCallbackRecord) {
    if (record.callbackType === 'pay') {
      payOrderInfo.init(record.orderId)
    } else {
      refundOrderInfo.init(record.orderId)
    }
  }
</script>

<style lang="less" scoped></style>
