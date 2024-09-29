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
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
      <div class="h-65vh">
        <vxe-table
          row-id="id"
          height="auto"
          align="center"
          ref="xTable"
          :data="pagination.records"
          :loading="loading"
          :sort-config="{ remote: true, trigger: 'cell' }"
          @sort-change="sortChange"
        >
          <vxe-column type="seq" title="序号" width="60" />
          <vxe-column field="name" title="对账标题" :min-width="120" />
          <vxe-column field="reconcileNo" title="对账单号" :min-width="230">
            <template #default="{ row }">
              <a-link @click="showReconcile(row)">{{ row.reconcileNo }}</a-link>
            </template>
          </vxe-column>
          <vxe-column field="reconcileDate" title="对账日期" sortable :min-width="180" />
          <vxe-column field="channel" title="通道" :min-width="150">
            <template #default="{ row }">
              <a-tag>{{ dictConvert('channel', row.channel) }}</a-tag>
            </template>
          </vxe-column>
          <vxe-column field="discrepancyType" title="差异类型" :min-width="180">
            <template #default="{ row }">
              <a-tag>{{ dictConvert('reconcile_discrepancy_type', row.discrepancyType) }}</a-tag>
            </template>
          </vxe-column>
          <vxe-column field="tradeNo" title="平台交易号" :min-width="230">
            <template #default="{ row }">
              <a-link v-if="row.tradeNo" @click="showTrade(row)">{{ row.tradeNo }}</a-link>
            </template>
          </vxe-column>
          <vxe-colgroup title="平台信息">
            <vxe-column field="bizTradeNo" title="商户交易号" :min-width="230" />
            <vxe-column field="tradeType" title="交易类型" :min-width="120">
              <template #default="{ row }">
                {{ dictConvert('trade_type', row.tradeType) }}
              </template>
            </vxe-column>
            <vxe-column field="tradeAmount" title="交易金额(元)" sortable :min-width="130" />
            <vxe-column field="tradeTime" title="交易时间" sortable :min-width="150" />
            <vxe-column field="tradeStatus" title="交易状态" :min-width="150">
              <template #default="{ row }">
                <a-tag v-if="row.tradeStatus">{{
                  dictConvert('trade_status', row.tradeStatus)
                }}</a-tag>
              </template>
            </vxe-column>
            <vxe-column field="outTradeNo" title="通道交易号" :min-width="230" />
          </vxe-colgroup>
          <vxe-colgroup title="通道信息">
            <vxe-column field="channelTradeNo" title="通道交易号" :min-width="230" />
            <vxe-column field="channelTradeAmount" title="交易金额(元)" sortable :min-width="150">
              <template #default="{ row }">
                {{ row.channelTradeAmount || '无' }}
              </template>
            </vxe-column>
            <vxe-column field="channelTradeTime" title="交易时间" sortable :min-width="150" />
            <vxe-column field="channelTradeType" title="交易类型" :min-width="120">
              <template #default="{ row }">
                {{ dictConvert('trade_type', row.channelTradeType) }}
              </template>
            </vxe-column>
            <vxe-column field="channelTradeStatus" title="交易状态" :min-width="150">
              <template #default="{ row }">
                <a-tag v-if="row.channelTradeStatus">{{
                  dictConvert('trade_status', row.channelTradeStatus)
                }}</a-tag>
              </template>
            </vxe-column>
          </vxe-colgroup>

          <vxe-column fixed="right" width="100" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <a-link @click="show(row)">查看</a-link>
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
    <ReconcileDiscrepancyInfo ref="reconcileDiscrepancyInfo" />
    <ReconcileStatementInfo ref="reconcileStatementInfo" />
    <PayOrderInfo ref="payOrderInfo" />
    <RefundOrderInfo ref="refundOrderInfo" />
    <TransferOrderInfo ref="transferOrderInfo" />
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, watch } from 'vue'
  import { page } from './ReconcileDiscrepancy.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { LIST, QueryField, STRING } from '@/components/Bootx/Query/Query'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '@/hooks/bootx/useDict'
  import { TradeTypeEnum } from '@/enums/daxpay/daxpayEnum'
  import ReconcileDiscrepancyInfo from './ReconcileDiscrepancyInfo.vue'
  import ReconcileStatementInfo from '../statement/ReconcileStatementInfo.vue'
  import PayOrderInfo from '@/views/daxpay/common/order/pay/PayOrderInfo.vue'
  import RefundOrderInfo from '@/views/daxpay/common/order/refund/RefundOrderInfo.vue'
  import TransferOrderInfo from '@/views/daxpay/common/order/transfer/TransferOrderInfo.vue'
  import { merchantDropdown } from '@/views/daxpay/admin/merchant/info/Merchant.api'
  import { mchAppDropdown } from '@/views/daxpay/common/merchant/app/MchApp.api'

  // 使用hooks
  const {
    handleTableChange,
    pageQueryResHandel,
    resetQueryParams,
    sortChange,
    pagination,
    pages,
    sortParam,
    model,
    loading,
  } = useTablePage(queryPage)
  const { dictDropDown, dictConvert } = useDict()

  const mchNoOptions = ref<LabeledValue[]>([])
  const mchAppOptions = ref<LabeledValue[]>([])
  let channelList = ref<LabeledValue[]>([])
  let discrepancyTypeList = ref<LabeledValue[]>([])
  let tradeStatusList = ref<LabeledValue[]>([])
  let tradeTypeList = ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'reconcileNo', type: STRING, name: '对账单号', placeholder: '请输入对账单号' },
      {
        field: 'channel',
        type: LIST,
        name: '对账通道',
        placeholder: '请选择对账通道',
        selectList: channelList.value,
      },
      {
        field: 'discrepancyType',
        type: LIST,
        name: '差异类型',
        placeholder: '请选择对账差异类型',
        selectList: discrepancyTypeList.value,
      },
      { field: 'tradeNo', type: STRING, name: '平台交易号', placeholder: '请输入平台交易号' },
      {
        field: 'bizTradeNo',
        type: STRING,
        name: '商户交易号(平台)',
        placeholder: '请输入商户交易号(平台)',
      },
      {
        field: 'outTradeNo',
        type: STRING,
        name: '通道交易号(平台)',
        placeholder: '请输入通道交易号(平台)',
      },
      {
        field: 'tradeType',
        type: LIST,
        name: '交易类型(平台)',
        placeholder: '请选择交易类型(平台)',
        selectList: tradeTypeList.value,
      },
      {
        field: 'tradeStatus',
        type: LIST,
        name: '交易状态(平台)',
        placeholder: '请选择交易状态(平台)',
        selectList: tradeStatusList.value,
      },
      {
        field: 'channelTradeNo',
        type: STRING,
        name: '交易号(通道)',
        placeholder: '请输入交易号(通道)',
      },
      {
        field: 'channelTradeType',
        type: LIST,
        name: '交易类型(通道)',
        placeholder: '请选择交易类型(通道)',
        selectList: tradeTypeList.value,
      },
      {
        field: 'channelTradeStatus',
        type: LIST,
        name: '交易状态(通道)',
        placeholder: '请选择交易状态(通道)',
        selectList: tradeStatusList.value,
      },
      {
        field: 'mchNo',
        type: LIST,
        name: '商户号',
        placeholder: '请选择商户号',
        selectList: mchNoOptions.value,
      },
      {
        field: 'appId',
        type: LIST,
        name: '应用号',
        placeholder: '请先选择商户后选择应用号',
        selectList: mchAppOptions.value,
      },
    ] as QueryField[]
  })

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const reconcileDiscrepancyInfo = ref<any>()
  const reconcileStatementInfo = ref<any>()
  const payOrderInfo = ref<any>()
  const refundOrderInfo = ref<any>()
  const transferInfo = ref<any>()

  nextTick(() => {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
  })

  onMounted(() => {
    initData()
    init()
  })
  watch(
    () => model.queryParam?.mchNo,
    (value) => changeMch(value),
  )
  /**
   * 初始化基础数据
   */
  async function initData() {
    merchantDropdown().then(({ data }) => {
      mchNoOptions.value = data
    })
    discrepancyTypeList.value = await dictDropDown('reconcile_discrepancy_type')
    channelList.value = await dictDropDown('channel')
    tradeStatusList.value = await dictDropDown('trade_status')
    tradeTypeList.value = await dictDropDown('trade_type')
  }

  /**
   * 商户变动后更新应用列表
   */
  function changeMch(mchNo) {
    if (mchNo) {
      mchAppDropdown(mchNo).then(({ data }) => {
        mchAppOptions.value = data
      })
    } else {
      mchAppOptions.value = []
      model.queryParam.appId = undefined
    }
  }
  /**
   * 入口
   */
  function init() {
    model.queryParam = {}
    xTable.value?.clearSort()
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
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
  /**
   * 查看差异记录
   */
  function show(record) {
    reconcileDiscrepancyInfo.value.init(record.id)
  }

  /**
   * 查看对账单
   */
  function showReconcile(record) {
    reconcileStatementInfo.value.init(record.reconcileId)
  }

  /**
   * 查看交易单
   */
  function showTrade(record) {
    if (record?.tradeType === TradeTypeEnum.PAY) {
      payOrderInfo.value.init(record.tradeNo)
    } else if (record?.tradeType === TradeTypeEnum.REFUND) {
      refundOrderInfo.value.init(record.tradeNo)
    } else if (record?.tradeType === TradeTypeEnum.TRANSFER) {
      transferInfo.value.init(record.tradeNo)
    }
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
