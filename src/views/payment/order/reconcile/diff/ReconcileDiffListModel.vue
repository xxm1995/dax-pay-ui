<template>
  <basic-drawer forceRender v-bind="$attrs" title="差异明细列表" width="60%" :visible="visible" @close="visible = false">
    <b-query :query-params="model.queryParam" :default-item-count="3" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
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
      <vxe-column field="title" title="订单标题" />
      <vxe-column field="orderType" title="订单类型">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('ReconcileTrade', row.orderType) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="diffType" title="差异类型">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('ReconcileDiffType', row.diffType) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="orderId" title="本地订单" />
      <vxe-column field="gatewayOrderNo" title="网关订单" />
      <vxe-column field="amount" title="交易金额" sortable />
      <vxe-column field="orderTime" title="订单时间" sortable />
      <vxe-column fixed="right" width="80" :showOverflow="false" title="操作">
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
    <reconcile-diff-info ref="reconcileDiffInfo" />
  </basic-drawer>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page } from './ReconcileDiff.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import ReconcileDiffInfo from './ReconcileDiffInfo.vue'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { ReconcileDetail } from '/@/views/payment/order/reconcile/detail/ReconcileDetail.api'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, sortChange, pagination, pages, sortParam, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage } = useMessage()
  const { dictDropDown, dictConvert } = useDict()

  let orderTypeList = $ref<LabeledValue[]>([])
  let diffTypeList = $ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'title', type: STRING, name: '订单名称', placeholder: '请输入订单名称' },
      { field: 'orderType', type: LIST, name: '订单类型', placeholder: '请选择订单类型', selectList: orderTypeList },
      { field: 'diffType', type: LIST, name: '差异类型', placeholder: '请选择差异类型', selectList: diffTypeList },
      { field: 'orderId', type: STRING, name: '本地定单', placeholder: '请输入本地定单ID' },
      { field: 'gatewayOrderNo', type: STRING, name: '网关订单号', placeholder: '请输入网关订单号' },
    ] as QueryField[]
  })
  let visible = $ref(false)
  let reconcileDetail = $ref<ReconcileDetail>()

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const reconcileDiffInfo = $ref<any>()

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
    orderTypeList = await dictDropDown('ReconcileTrade')
    diffTypeList = await dictDropDown('ReconcileDiffType')
  }
  /**
   * 入口
   */
  function init(record: ReconcileDetail) {
    visible = true
    reconcileDetail = record
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
      recordId: reconcileDetail?.id,
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
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
