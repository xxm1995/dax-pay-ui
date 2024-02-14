<template>
  <basic-drawer forceRender v-bind="$attrs" title="对账单明细列表" width="60%" :visible="visible" @close="visible = false">
    <b-query :query-params="model.queryParam" :default-item-count="3" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
    <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
      <vxe-column type="seq" width="60" />
      <vxe-column field="title" title="商品名称" />
      <vxe-column field="amount" title="交易金额" />
      <vxe-column field="paymentId" title="支付订单ID" />
      <vxe-column field="refundId" title="退款订单ID" />
      <vxe-column field="gatewayOrderNo" title="网关订单号" />
      <vxe-column field="repairType" title="交易类型">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('PayReconcileTrade', row.type) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column fixed="right" width="60" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
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
    <reconcile-detail-info ref="reconcileDetailInfo" />
  </basic-drawer>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { pageDetail, ReconcileDetail } from './ReconcileOrder.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import ReconcileDetailInfo from './ReconcileDetailInfo.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '/@/hooks/bootx/useDict'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage } = useMessage()
  const { dictDropDown, dictConvert } = useDict()

  let reconcileTradeList = $ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'title', type: STRING, name: '订单名称', placeholder: '请输入订单名称' },
      { field: 'paymentId', type: STRING, name: '本地支付ID', placeholder: '请输入本地支付ID' },
      { field: 'refundId', type: STRING, name: '本地退款ID', placeholder: '请输入本地退款ID' },
      { field: 'gatewayOrderNo', type: STRING, name: '网关订单号', placeholder: '请输入网关订单号' },
      { field: 'type', type: LIST, name: '交易类型', placeholder: '请选择交易类型', selectList: reconcileTradeList },
    ] as QueryField[]
  })
  let visible = $ref(false)
  let reconcileDetail = $ref<ReconcileDetail>()

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const reconcileDetailInfo = $ref<any>()

  nextTick(() => {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  })

  onMounted(() => {
    initData()
  })

  /**
   * 初始化基础数据
   */
  async function initData() {
    reconcileTradeList = await dictDropDown('PayReconcileTrade')
  }
  /**
   * 入口
   * @param record
   */
  function init(record) {
    visible = true
    reconcileDetail = record
    queryPage()
  }

  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    pageDetail({
      ...model.queryParam,
      ...pages,
      recordOrderId: reconcileDetail?.id,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
  /**
   * 查看
   */
  function show(record) {
    reconcileDetailInfo.init(record)
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
