<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :query-params="model.queryParam"
        :default-item-count="3"
        :fields="fields"
        @query="queryPage"
        @reset="resetQueryParams"
      />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <span style="font-size: 18px"
            >收入金额: {{ totalAmount.incomeAmount ? totalAmount.incomeAmount : 0 }}元</span
          >
          <span style="font-size: 18px; margin-left: 50px"
            >支出金额: {{ totalAmount.outlayAmount ? totalAmount.outlayAmount : 0 }}元</span
          >
        </template>
      </vxe-toolbar>
      <div class="h-65vh">
        <vxe-table
          height="auto"
          row-id="id"
          ref="xTable"
          :data="pagination.records"
          :loading="loading"
        >
          <vxe-column type="seq" title="序号" width="60" />
          <vxe-column field="title" title="标题" :min-width="230" />
          <vxe-column field="amount" title="金额(元)" :min-width="120" sortable>
            <template #default="{ row }">
              {{ row.amount || '空' }}
            </template>
          </vxe-column>
          <vxe-column field="type" title="流水类型" :min-width="120">
            <template #default="{ row }">
              <a-tag>{{ dictConvert('TradeFlowRecordType', row.type) || '无' }}</a-tag>
            </template>
          </vxe-column>
          <vxe-column field="channel" title="交易通道" :min-width="100">
            <template #default="{ row }">
              <a-tag>{{ dictConvert('AsyncPayChannel', row.channel) || '无' }}</a-tag>
            </template>
          </vxe-column>
          <vxe-column field="tradeNo" title="平台交易号" :min-width="230">
            <template #default="{ row }">
              <a @click="showOrder(row)">
                {{ row.tradeNo }}
              </a>
            </template>
          </vxe-column>
          <vxe-column field="bizTradeNo" title="商户交易号" :min-width="230" />
          <vxe-column field="outTradeNo" title="通道交易号" :min-width="230" />
          <vxe-column field="createTime" title="时间" :min-width="160" sortable />
          <vxe-column fixed="right" :min-width="60" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <span>
                <a-link @click="show(row)">查看</a-link>
              </span>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <vxe-pager
        size="medium"
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
    </div>
    <TradeFlowRecordInfo ref="tradeFlowRecordInfo" />
    <PayOrderInfo ref="payOrderInfo" />
    <RefundOrderInfo ref="refundOrderInfo" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { page } from './TradeFlowRecord.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '@/components/Bootx/Query/BQuery.vue'
  import { LIST, QueryField, STRING } from '@/components/Bootx/Query/Query'
  import { useDict } from '@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import PayOrderInfo from '@/views/daxpay/admin/order/pay/PayOrderInfo.vue'
  import RefundOrderInfo from '@/views/daxpay/admin/order/refund/RefundOrderInfo.vue'
  import ALink from '@/components/Link/Link.vue'
  import TradeFlowRecordInfo from './TradeFlowRecordInfo.vue'

  // 使用hooks
  const {
    handleTableChange,
    pageQueryResHandel,
    resetQueryParams,
    pagination,
    pages,
    model,
    loading,
  } = useTablePage(queryPage)
  const { dictConvert, dictDropDown } = useDict()

  const payChannelList = ref<LabeledValue[]>([])
  const tradeFlowRecordTypeList = ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'title', type: STRING, name: '订单标题', placeholder: '请输入订单标题' },
      { field: 'tradeNo', type: STRING, name: '平台交易号', placeholder: '请输入平台交易号' },
      { field: 'bizTradeNo', type: STRING, name: '商户交易号', placeholder: '请输入商户交易号' },
      { field: 'outTradeNo', type: STRING, name: '通道交易号', placeholder: '请输入通道交易号' },
      {
        field: 'type',
        type: LIST,
        name: '流水类型',
        placeholder: '请选择流水类型',
        selectList: tradeFlowRecordTypeList.value,
      },
      {
        field: 'channel',
        type: LIST,
        name: '交易通道',
        placeholder: '请选择交易通道',
        selectList: payChannelList.value,
      },
    ] as QueryField[]
  })

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const payOrderInfo = ref<any>()
  const refundOrderInfo = ref<any>()
  const tradeFlowRecordInfo = ref<any>()
  const totalAmount = ref({
    incomeAmount: 0.0,
    outlayAmount: 0.0,
  })

  onMounted(() => {
    init()
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
  }

  /**
   * 初始化
   */
  async function init() {
    tradeFlowRecordTypeList.value = await dictDropDown('TradeFlowRecordType')
    payChannelList.value = await dictDropDown('PayChannel')
  }

  /**
   * 分页查询
   */
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
  /**
   * 查看
   */
  function show(record) {
    tradeFlowRecordInfo.value.init(record.id)
  }

  /**
   * 查看支付单信息
   */
  function showOrder(record) {
    if (record.type === 'pay') {
      payOrderInfo.value.init(record.tradeNo)
    } else if (record.type === 'refund') {
      refundOrderInfo.value.init(record.tradeNo)
    }
  }
</script>

<style lang="less" scoped></style>
