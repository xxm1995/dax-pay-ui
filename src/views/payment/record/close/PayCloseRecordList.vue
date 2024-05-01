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
        <vxe-column field="orderNo" title="订单号" min-width="180">
          <template #default="{ row }">
            <a @click="showPayOder(row.orderNo)">
              {{ row.orderNo }}
            </a>
          </template>
        </vxe-column>
        <vxe-column field="bizOrderNo" title="商户订单号" min-width="180" />
        <vxe-column field="closed" title="关闭状态">
          <template #default="{ row }">
            <a-tag v-if="row.closed" color="green">成功</a-tag>
            <a-tag v-else color="red">失败</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="channel" title="支付通道">
          <template #default="{ row }">
            {{ dictConvert('PayChannel', row.channel) }}
          </template>
        </vxe-column>
        <vxe-column field="errorMsg" title="错误消息" />
        <vxe-column field="clientIp" title="客户端IP" />
        <vxe-column field="createTime" title="请求时间" />
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
    </div>
    <pay-close-record-info ref="payCloseRecordInfo" />
    <pay-order-info ref="payOrderInfo" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page } from './PayCloseRecord.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import PayCloseRecordInfo from './PayCloseRecordInfo.vue'
  import PayOrderInfo from '/@/views/payment/order/pay/PayOrderInfo.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, sortChange, sortParam, pages, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let payChannelList = $ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'paymentId', type: STRING, name: '支付单号', placeholder: '请输入支付单号' },
      { field: 'businessNo', type: STRING, name: '业务号', placeholder: '请输入业务号' },
      {
        field: 'channel',
        type: LIST,
        name: '支付通道',
        placeholder: '请选择支付通道',
        selectList: payChannelList,
      },
      {
        field: 'closed',
        type: LIST,
        name: '关闭状态',
        placeholder: '请选择关闭状态',
        selectList: [
          { label: '成功', value: true },
          { label: '失败', value: false },
        ],
      },
    ] as QueryField[]
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const payCloseRecordInfo = $ref<any>()
  const payOrderInfo = $ref<any>()

  onMounted(() => {
    init()
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化
   */
  async function init() {
    payChannelList = await dictDropDown('PayChannel')
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
    payCloseRecordInfo.init(record.id)
  }

  /**
   * 查看支付单信息
   */
  function showPayOder(orderNo) {
    payOrderInfo.init(orderNo)
  }
</script>

<style lang="less" scoped></style>
