<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :query-params="model.queryParam"
        :fields="fields"
        :default-item-count="3"
        :sort-config="{ remote: true, trigger: 'cell' }"
        @query="queryPage"
        @reset="resetQueryParams"
        @sort-change="sortChange"
      />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <span style="font-size: 18px"
            >退款金额: {{ totalAmount ? (totalAmount / 100).toFixed(2) : 0 }}元</span
          >
        </template>
      </vxe-toolbar>
      <vxe-table
        row-id="id"
        :cell-style="cellStyle"
        ref="xTable"
        :sort-config="{ remote: true, trigger: 'cell' }"
        :data="pagination.records"
        :loading="loading"
        @sort-change="sortChange"
      >
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="refundNo" title="退款号" :min-width="230">
          <template #default="{ row }">
            <a @click="show(row)">
              {{ row.refundNo }}
            </a>
          </template>
        </vxe-column>
        <vxe-column field="title" title="原支付标题" :min-width="160" />
        <vxe-column field="orderNo" title="支付订单号" :min-width="230">
          <template #default="{ row }">
            <a @click="showPayOrder(row)">
              {{ row.orderNo }}
            </a>
          </template>
        </vxe-column>
        <vxe-column field="channel" title="支付通道" :min-width="120">
          <template #default="{ row }">
            {{ dictConvert('PayChannel', row.channel) }}
          </template>
        </vxe-column>
        <vxe-column field="amount" title="退款金额(元)" :min-width="140">
          <template #default="{ row }">
            {{ row.amount ? (row.amount / 100).toFixed(2) : 0 }}
          </template>
        </vxe-column>
        <vxe-column field="refundStatus" title="状态" :min-width="80">
          <template #default="{ row }">
            {{ dictConvert('RefundStatus', row.status) }}
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间" sortable :min-width="230" />
        <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <!--      钱包不可以同步      -->
            <a-link @click="sync(row)">同步</a-link>
            <a-divider type="vertical" />
            <a-link :disabled="!(row.status === 'fail')" @click="reset(row)">重试</a-link>
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
      <RefundOrderInfo ref="refundOrderInfo" @ok="queryPage" />
      <PayOrderInfo ref="payOrderInfo" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { getTotalAmount, page, resetRefund, syncByRefundNo } from './RefundOrder.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import RefundOrderInfo from './RefundOrderInfo.vue'
  import { VxeTable, VxeTableInstance, VxeToolbar, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '@/components/Bootx/Query/Query'
  import { useDict } from '@/hooks/bootx/useDict'
  import PayOrderInfo from '../pay/PayOrderInfo.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import ALink from '@/components/Link/Link.vue'

  // 使用hooks
  const {
    handleTableChange,
    pageQueryResHandel,
    resetQueryParams,
    sortChange,
    sortParam,
    pagination,
    pages,
    model,
    loading,
  } = useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  const channelList = ref<LabeledValue[]>([])
  const refundStatusList = ref<LabeledValue[]>([])
  const totalAmount = ref<number>(0.0)

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'bizRefundNo', type: STRING, name: '商户退款号', placeholder: '请输入商户退款号' },
      { field: 'refundNo', type: STRING, name: '退款号', placeholder: '请输入退款号' },
      { field: 'outRefundNo', type: STRING, name: '通道退款号', placeholder: '请输入通道退款号' },
      {
        field: 'bizOrderNo',
        type: STRING,
        name: '商户订单号',
        placeholder: '请输入商户支付订单号',
      },
      { field: 'orderNo', type: STRING, name: '订单号', placeholder: '请输入支付订单号' },
      {
        field: 'outOrderNo',
        type: STRING,
        name: '通道订单号',
        placeholder: '请输入三方支付的通道订单号',
      },
      { field: 'title', type: STRING, name: '原支付标题', placeholder: '请输入原支付标题' },
      { field: 'errorCode', name: '错误码', type: STRING },
      {
        field: 'status',
        type: LIST,
        name: '处理状态',
        placeholder: '请选择处理状态',
        selectList: refundStatusList.value,
      },
      { field: 'channel', name: '支付通道', type: LIST, selectList: channelList.value },
    ] as QueryField[]
  })

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const refundOrderInfo = ref<any>()
  const payOrderInfo = ref<any>()

  onMounted(() => {
    initData()
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    refundStatusList.value = await dictDropDown('RefundStatus')
    channelList.value = await dictDropDown('PayChannel')
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
    // 汇总数据
    getTotalAmount({
      ...model.queryParam,
    }).then(({ data }) => {
      totalAmount.value = data
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
        syncByRefundNo(record.refundNo).then(({ data }) => {
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
    refundOrderInfo.value.init(record.refundNo)
  }

  /**
   * 查看支付单信息
   */
  function showPayOrder(record) {
    payOrderInfo.value.init(record.orderNo)
  }

  function cellStyle({ row, column }) {
    if (column.field == 'refundStatus') {
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
    if (column.field == 'async') {
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
</script>

<style lang="less" scoped></style>
