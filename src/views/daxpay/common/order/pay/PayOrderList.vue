<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :query-params="model.queryParam"
        :fields="fields"
        @query="queryPage"
        @reset="resetQueryParams"
      />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <span style="font-size: 18px">收款金额: {{ totalAmount || 0 }}元</span>
        </template>
      </vxe-toolbar>
      <div class="h-65vh">
        <vxe-table
          height="auto"
          row-id="id"
          ref="xTable"
          :cell-style="cellStyle"
          :data="pagination.records"
          :loading="loading"
          :sort-config="{ remote: true, trigger: 'cell' }"
          @sort-change="sortChange"
        >
          <vxe-column type="seq" title="序号" width="60" />
          <vxe-column field="orderNo" title="订单号" :min-width="230">
            <template #default="{ row }">
              <a @click="show(row)">
                {{ row.orderNo }}
              </a>
            </template>
          </vxe-column>
          <vxe-column field="title" title="标题" :min-width="230" />
          <vxe-column field="channel" title="支付通道" :min-width="150">
            <template #default="{ row }">
              {{ dictConvert('channel', row.channel) }}
            </template>
          </vxe-column>
          <vxe-column field="bizOrderNo" title="商户订单号" :min-width="230" />
          <vxe-column field="amount" title="金额(元)" :min-width="120" sortable>
            <template #default="{ row }">
              {{ row.amount }}
            </template>
          </vxe-column>
          <vxe-column field="refundableBalance" title="可退余额(元)" :min-width="120" sortable>
            <template #default="{ row }">
              {{ row.refundableBalance }}
            </template>
          </vxe-column>
          <vxe-column field="status" title="支付状态" :min-width="120">
            <template #default="{ row }">{{
              dictConvert('pay_status', row.status) || '无'
            }}</template>
          </vxe-column>
          <vxe-column field="refundStatus" title="退款状态" :min-width="120">
            <template #default="{ row }">{{
              dictConvert('pay_refund_status', row.refundStatus) || ''
            }}</template>
          </vxe-column>
          <vxe-column field="allocation" title="分账" :min-width="160">
            <template #default="{ row }">
              <a-tag v-if="row.allocation" color="green">支持</a-tag>
              <a-tag v-else color="red">不支持</a-tag>
            </template>
          </vxe-column>
          <vxe-column field="allocStatus" title="分账状态" :min-width="160">
            <template #default="{ row }">
              {{ dictConvert('pay_alloc_status', row.allocStatus) || '无' }}
            </template>
          </vxe-column>
          <vxe-column field="createTime" title="创建时间" sortable :min-width="230" />
          <vxe-column field="mchNo" title="商户号" :min-width="150" />
          <vxe-column field="appId" title="应用号" :min-width="150" />
          <vxe-column fixed="right" width="120" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <a-link @click="show(row)">查看</a-link>
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
                    <a-menu-item v-if="[PayStatusEnum.PROGRESS].includes(row.status)">
                      <a-link @click="closeOrder(row)" danger>关闭</a-link>
                    </a-menu-item>
                    <a-menu-item v-if="[PayStatusEnum.PROGRESS].includes(row.status)">
                      <a-link @click="cancelOrder(row)" danger>撤销</a-link>
                    </a-menu-item>
                    <a-menu-item
                      v-if="
                        row.allocStatus === PayAllocStatusEnum.WAITING &&
                        PayStatusEnum.SUCCESS === row.status
                      "
                    >
                      <a-link @click="allocation(row)">分账</a-link>
                    </a-menu-item>
                    <a-menu-item
                      v-if="
                        [PayStatusEnum.SUCCESS].includes(row.status) &&
                        row.refundableBalance > 0 &&
                        [
                          PayRefundStatusEnum.NO_REFUND,
                          PayRefundStatusEnum.PARTIAL_REFUND,
                        ].includes(row.refundStatus)
                      "
                    >
                      <a-link @click="refund(row)" danger>退款</a-link>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
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
      <PayOrderInfo ref="payOrderInfo" />
      <RefundModel ref="refundModel" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import {
    allocationByOrderNo,
    close,
    getTotalAmount,
    page,
    syncOrder,
    cellStyle,
    cancel,
  } from './PayOrder.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import PayOrderInfo from './PayOrderInfo.vue'
  import BQuery from '@/components/Bootx/Query/BQuery.vue'
  import RefundModel from './RefundModel.vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '@/components/Bootx/Query/Query'
  import { useDict } from '@/hooks/bootx/useDict'
  import { VxeTableInstance, VxeToolbarInstance, VxeTable, VxeToolbar } from 'vxe-table'
  import ALink from '@/components/Link/Link.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { Icon } from '@/components/Icon'
  import {
    PayAllocStatusEnum,
    PayRefundStatusEnum,
    PayStatusEnum,
  } from '@/enums/daxpay/tradeStatusEnum'
  import { merchantDropdown } from '@/views/daxpay/admin/merchant/info/Merchant.api'
  import { mchAppDropdown } from '@/views/daxpay/common/merchant/app/MchApp.api'

  // 使用hooks
  const {
    handleTableChange,
    pageQueryResHandel,
    sortChange,
    resetQueryParams,
    pagination,
    pages,
    sortParam,
    model,
    loading,
  } = useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  const mchNoOptions = ref<LabeledValue[]>([])
  const mchAppOptions = ref<LabeledValue[]>([])
  const channelList = ref<LabeledValue[]>([])
  const methodList = ref<LabeledValue[]>([])
  const payStatusList = ref<LabeledValue[]>([])
  const payRefundStatusList = ref<LabeledValue[]>([])
  const payAllocStatusList = ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'orderNo', type: STRING, name: '订单号', placeholder: '请输入支付订单号' },
      { field: 'bizOrderNo', type: STRING, name: '商户订单号', placeholder: '请输入商户订单号' },
      {
        field: 'outOrderNo',
        type: STRING,
        name: '通道订单号',
        placeholder: '请输入外部三方支付系统中的订单号',
      },
      { field: 'title', type: STRING, name: '标题', placeholder: '请输入标题' },
      {
        field: 'allocation',
        name: '支持分账',
        type: LIST,
        selectList: [
          { label: '支持', value: true },
          { label: '不支持', value: false },
        ],
      },
      { field: 'channel', name: '支付通道', type: LIST, selectList: channelList.value },
      { field: 'method', name: '支付方式', type: LIST, selectList: methodList.value },
      { field: 'status', name: '支付状态', type: LIST, selectList: payStatusList.value },
      {
        field: 'refundStatus',
        name: '退款状态',
        type: LIST,
        selectList: payRefundStatusList.value,
      },
      { field: 'allocStatus', name: '分账状态', type: LIST, selectList: payAllocStatusList.value },
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
  const payOrderInfo = ref<any>()
  const refundModel = ref<any>()
  const totalAmount = ref<number>(0.0)

  // 提供一个 getter 函数
  watch(
    () => model.queryParam?.mchNo,
    (value) => changeMch(value),
  )

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
    merchantDropdown().then(({ data }) => {
      mchNoOptions.value = data
    })
    channelList.value = await dictDropDown('channel')
    methodList.value = await dictDropDown('pay_method')
    payStatusList.value = await dictDropDown('pay_status')
    payRefundStatusList.value = await dictDropDown('pay_refund_status')
    payAllocStatusList.value = await dictDropDown('pay_alloc_status')
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
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    // 查询列表
    page({
      ...model.queryParam,
      ...pages,
      ...sortParam,
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
   * 查看
   */
  function show(record) {
    payOrderInfo.value.init(record.orderNo)
  }

  /**
   * 同步信息
   */
  function sync(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否同步支付信息，只有状态支付中的订单才会对状态进行更新',
      onOk: () => {
        loading.value = true
        syncOrder(record.id).then(() => {
          createMessage.success('同步成功')
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
   * 撤销订单
   */
  function cancelOrder(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '只有部分类型的订单支持撤销操作，请注意!',
      onOk: () => {
        cancel(record.id).then(() => {
          createMessage.success('撤销成功')
          queryPage()
        })
      },
    })
  }
  /**
   * 退款
   */
  function refund(record) {
    refundModel.value.init(record.id)
  }

  /**
   * 触发分账
   */
  function allocation(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否触发该订单的分账操作',
      onOk: () => {
        allocationByOrderNo(record.orderNo).then(() => {
          createMessage.success('分账请求已发送')
          queryPage()
        })
      },
    })
  }
</script>

<style lang="less" scoped></style>
