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
        :cell-style="cellStyle"
        :data="pagination.records"
        :loading="loading"
        :sort-config="{ remote: true, trigger: 'cell' }"
        @sort-change="sortChange"
      >
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="businessNo" title="业务号" width="180" />
        <vxe-column field="title" title="标题" width="220" />
        <vxe-column field="amount" title="金额(分)" width="120" sortable />
        <vxe-column field="refundableBalance" title="可退余额(分)" width="120" sortable />
        <vxe-column field="status" title="支付状态" width="120">
          <template #default="{ row }">{{ dictConvert('PayStatus', row.status) }}</template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间" sortable width="220" />
        <vxe-column field="id" title="支付ID" sortable width="220" />

        <vxe-column field="asyncPay" title="异步支付" width="120">
          <template #default="{ row }">{{ row.asyncPay ? '是' : '否' }}</template>
        </vxe-column>
        <vxe-column field="combinationPayMode" title="组合支付" width="120">
          <template #default="{ row }">{{ row.combinationPayMode ? '是' : '否' }}</template>
        </vxe-column>
        <vxe-column field="asyncChannel" title="异步支付方式" width="160">
          <template #default="{ row }">{{ dictConvert('PayChannel', row.asyncChannel) || '无' }}</template>
        </vxe-column>
        <vxe-column field="expiredTime" title="过期时间" sortable width="220" />
        <vxe-column fixed="right" width="200" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link @click="showChannel(row)">通道订单</a-link>
            <a-divider type="vertical" />
            <a-dropdown>
              <a>
                更多
                <icon icon="ant-design:down-outlined" :size="12" />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-link @click="sync(row)">同步</a-link>
                  </a-menu-item>
                  <a-menu-item v-if="[PayStatus.PROGRESS].includes(row.status)">
                    <a-link @click="closeOrder(row)" danger>关闭</a-link>
                  </a-menu-item>
                  <a-menu-item v-if="[PayStatus.SUCCESS, PayStatus.PARTIAL_REFUND].includes(row.status) && row.refundableBalance > 0">
                    <a-link @click="refund(row)" danger>退款</a-link>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
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
      <pay-order-info ref="payOrderInfo" />
      <pay-channel-order-list ref="payChannelOrderList" />
      <refund-model ref="refundModel" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { $ref } from 'vue/macros'
import { close, page, syncById } from './PayOrder.api'
import useTablePage from '/@/hooks/bootx/useTablePage'
import PayOrderInfo from './PayOrderInfo.vue'
import RefundModel from './RefundModel.vue'
import BQuery from '/@/components/Bootx/Query/BQuery.vue'
import { useMessage } from '/@/hooks/web/useMessage'
import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
import { useDict } from '/@/hooks/bootx/useDict'
import { VxeTableInstance, VxeToolbarInstance, VxePager, VxeTable, VxeToolbar } from 'vxe-table'
import ALink from '/@/components/Link/Link.vue'
import { PayStatus } from '/@/enums/payment/PayStatus'
import { LabeledValue } from 'ant-design-vue/lib/select'
import PayChannelOrderList from './PayChannelOrderList.vue'

// 使用hooks
const { handleTableChange, pageQueryResHandel, sortChange, resetQueryParams, pagination, pages, sortParam, model, loading } =
  useTablePage(queryPage)
const { notification, createMessage, createConfirm } = useMessage()
const { dictConvert, dictDropDown } = useDict()

let cayChannelList = $ref<LabeledValue[]>([])
let payStatusList = $ref<LabeledValue[]>([])

// 查询条件
const fields = computed(() => {
  return [
    { field: 'id', type: STRING, name: '支付ID', placeholder: '请输入完整支付ID' },
    { field: 'businessNo', type: STRING, name: '业务号', placeholder: '请输入业务号' },
    { field: 'gatewayOrderNo', type: STRING, name: '网关订单号', placeholder: '请输入完整网关订单号' },
    { field: 'title', type: STRING, name: '标题', placeholder: '请输入标题' },
    { field: 'errorCode', name: '错误码', type: STRING },
    { field: 'asyncChannel', name: '异步支付方式', type: LIST, selectList: cayChannelList },
    { field: 'status', name: '支付状态', type: LIST, selectList: payStatusList },
  ] as QueryField[]
})

const xTable = $ref<VxeTableInstance>()
const xToolbar = $ref<VxeToolbarInstance>()
const payOrderInfo = $ref<any>()
const payChannelOrderList = $ref<any>()
const refundModel = $ref<any>()

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
  cayChannelList = await dictDropDown('AsyncChannel')
  payStatusList = await dictDropDown('PayStatus')
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
  payOrderInfo.init(record.id)
}
/**
 * 查看
 */
function showChannel(record) {
  payChannelOrderList.init(record)
}

/**
 * 同步信息
 */
function sync(record) {
  createConfirm({
    iconType: 'warning',
    title: '警告',
    content: '是否同步支付信息',
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
 * 关闭支付
 */
function closeOrder(record) {
  createConfirm({
    iconType: 'warning',
    title: '警告',
    content: '是否关闭支付订单',
    onOk: () => {
      close(record.id).then(() => {
        createMessage.success('关闭成功')
        queryPage()
      })
    },
  })
}
/**
 * 退款
 */
function refund(record) {
  refundModel.init(record.id)
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
  if (column.field == 'combinationPayMode') {
    if (row.combinationPayMode) {
      return { color: 'green' }
    } else {
      return { color: 'gray' }
    }
  }
}
</script>

<style lang="less" scoped></style>
