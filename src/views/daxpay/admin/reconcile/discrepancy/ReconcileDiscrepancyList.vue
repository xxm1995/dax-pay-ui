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
      <vxe-table
        row-id="id"
        ref="xTable"
        :data="pagination.records"
        :loading="loading"
        :sort-config="{ remote: true, trigger: 'cell' }"
        @sort-change="sortChange"
      >
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="title" title="订单标题" :min-width="120" />
        <vxe-column field="reconcileDate" title="对账日期" sortable :min-width="120" />
        <vxe-column field="channel" title="通道" :min-width="120">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayChannel', row.channel) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="tradeType" title="交易类型" :min-width="120">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PaymentType', row.tradeType) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="diffType" title="差异类型" :min-width="120">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('ReconcileDiffType', row.diffType) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="tradeNo" title="本地交易号" :min-width="230">
          <template #default="{ row }">
            <a-link @click="showTrade(row)">{{ row.tradeNo }}</a-link>
          </template>
        </vxe-column>
        <vxe-column field="outTradeNo" title="通道交易号" :min-width="230" />
        <vxe-column field="amount" title="交易金额(元)" sortable :min-width="130">
          <template #default="{ row }">
            {{ row.amount ? (row.amount / 100).toFixed(2) : '无' }}
          </template>
        </vxe-column>
        <vxe-column field="outAmount" title="通道交易金额(元)" sortable :min-width="150">
          <template #default="{ row }">
            {{ row.outAmount ? (row.outAmount / 100).toFixed(2) : '无' }}
          </template>
        </vxe-column>
        <vxe-column field="tradeTime" title="交易时间" sortable :min-width="150" />
        <vxe-column field="reconcileNo" title="对账单号" :min-width="230">
          <template #default="{ row }">
            <a-link @click="showReconcile(row)">{{ row.reconcileNo }}</a-link>
          </template>
        </vxe-column>
        <vxe-column fixed="right" width="100" :showOverflow="false" title="操作">
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted } from 'vue'
  import { page } from './ReconcileDiscrepancy.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '@/components/Bootx/Query/Query'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '@/hooks/bootx/useDict'

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
  const { notification, createMessage } = useMessage()
  const { dictDropDown, dictConvert } = useDict()

  let tradeTypeList = ref<LabeledValue[]>([])
  let diffTypeList = ref<LabeledValue[]>([])
  let payChannelList = ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'reconcileNo', type: STRING, name: '对账单号', placeholder: '请输入对账单号' },
      { field: 'title', type: STRING, name: '订单名称', placeholder: '请输入订单名称' },
      {
        field: 'tradeType',
        type: LIST,
        name: '交易类型',
        placeholder: '请选择交易类型',
        selectList: tradeTypeList,
      },
      {
        field: 'diffType',
        type: LIST,
        name: '差异类型',
        placeholder: '请选择差异类型',
        selectList: diffTypeList,
      },
      {
        field: 'channel',
        type: LIST,
        name: '对账通道',
        placeholder: '请选择对账',
        selectList: payChannelList,
      },
      { field: 'tradeNo', type: STRING, name: '本地交易号', placeholder: '请输入本地交易号' },
      { field: 'outOrderNo', type: STRING, name: '通道交易号', placeholder: '请输入通道交易号' },
    ] as QueryField[]
  })

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const reconcileDiffInfo = ref<any>()
  const payOrderInfo = ref<any>()
  const refundOrderInfo = ref<any>()
  const reconcileDetailInfo = ref<any>()

  nextTick(() => {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  })

  onMounted(() => {
    initData()
    init()
  })

  /**
   * 初始化基础数据
   */
  async function initData() {
    tradeTypeList = await dictDropDown('PaymentType')
    diffTypeList = await dictDropDown('ReconcileDiffType')
    payChannelList = await dictDropDown('PayChannel')
  }
  /**
   * 入口
   */
  function init() {
    model.queryParam = {}
    xTable?.clearSort()
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
   * 查看
   */
  function show(record) {
    reconcileDiffInfo.init(record)
  }

  /**
   * 查看对账单
   */
  function showReconcile(record) {
    reconcileDiffInfo.init(record)
  }

  /**
   * 查看交易单
   */
  function showTrade(record) {
    if (record.callbackType === 'pay') {
      payOrderInfo.init(record.tradeNo)
    } else {
      refundOrderInfo.init(record.tradeNo)
    }
  }
  /**
   * 查看通道交易信息
   */
  function showOutTrade(record) {
    reconcileDetailInfo.init(record.outTradeNo)
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
