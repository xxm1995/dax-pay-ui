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
        <vxe-column field="repairId" title="修复号" width="170" />
        <vxe-column field="orderId" title="被修复订单ID" width="170">
          <template #default="{ row }">
            <a @click="showOrder(row)">
              {{ row.orderId }}
            </a>
          </template>
        </vxe-column>
        <vxe-column field="orderNo" title="本地业务号" />
        <vxe-column field="repairSource" title="修复来源">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayRepairSource', row.repairSource) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="repairType" title="修复类型">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PaymentType', row.repairType) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="repairWay" title="修复方式">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayRepairWay', row.repairWay) || dictConvert('RefundRepairWay', row.repairWay) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="修复时间" />
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
    <pay-repair-record-info ref="payRepairRecordInfo" />
    <pay-order-info ref="payOrderInfo" />
    <refund-order-info ref="refundOrderInfo" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page, PayRepairRecord } from './PayRepairRecord.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import PayRepairRecordInfo from './PayRepairRecordInfo.vue'
  import PayOrderInfo from '/@/views/payment/order/pay/PayOrderInfo.vue'
  import RefundOrderInfo from '/@/views/payment/order/refund/RefundOrderInfo.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, sortChange, sortParam, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let repairSourceList = $ref<LabeledValue[]>([])
  let repairTypeList = $ref<LabeledValue[]>([])
  let repairWayList = $ref<LabeledValue[]>([])
  let asyncChannelList = $ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'paymentId', type: STRING, name: '支付单号', placeholder: '请输入支付单号' },
      { field: 'businessNo', type: STRING, name: '业务号', placeholder: '请输入业务号' },
      {
        field: 'repairSource',
        type: LIST,
        name: '修复来源',
        placeholder: '请选择修复来源',
        selectList: repairSourceList,
      },
      {
        field: 'repairType',
        type: LIST,
        name: '修复类型',
        placeholder: '请选择修复类型',
        selectList: repairTypeList,
      },
      {
        field: 'repairWay',
        type: LIST,
        name: '修复方式',
        placeholder: '请选择修复方式',
        selectList: repairWayList,
      },
      {
        field: 'asyncChannel',
        type: LIST,
        name: '修复通道',
        placeholder: '请选择修复通道',
        selectList: asyncChannelList,
      },
    ] as QueryField[]
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const payRepairRecordInfo = $ref<any>()
  const payOrderInfo = $ref<any>()
  const refundOrderInfo = $ref<any>()

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
    repairSourceList = await dictDropDown('PayRepairSource')
    repairTypeList = await dictDropDown('PaymentType')
    asyncChannelList = await dictDropDown('AsyncPayChannel')
    repairWayList = (await dictDropDown('PayRepairWay')).concat(await dictDropDown('RefundRepairWay'))
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
    payRepairRecordInfo.init(record.id)
  }

  /**
   * 查看订单单信息
   */
  function showOrder(record: PayRepairRecord) {
    console.log(record)
    if (record.repairType === 'pay') {
      payOrderInfo.init(record.orderId)
    } else {
      refundOrderInfo.init(record.orderId)
    }
  }
</script>

<style lang="less" scoped></style>
