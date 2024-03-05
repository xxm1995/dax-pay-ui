<template>
  <basic-drawer forceRender v-bind="$attrs" title="对账单明细列表" width="60%" :visible="visible" @close="visible = false">
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
      <vxe-column type="seq" width="60" />
      <vxe-column field="title" title="订单名称" />
      <vxe-column field="amount" title="交易金额" />
      <vxe-column field="orderId" title="本地订单ID" />
      <vxe-column field="gatewayOrderNo" title="网关订单号" />
      <vxe-column field="repairType" title="交易类型">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('ReconcileTrade', row.type) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="orderTime" title="订单时间" sortable />
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
    <reconcile-detail-info ref="reconcileDetailInfo" />
  </basic-drawer>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page, ReconcileDetail } from './ReconcileDetail.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import ReconcileDetailInfo from './ReconcileDetailInfo.vue'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '/@/hooks/bootx/useDict'
  import ALink from '/@/components/Link/Link.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, sortChange, pages, sortParam, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage } = useMessage()
  const { dictDropDown, dictConvert } = useDict()

  let reconcileTradeList = $ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'title', type: STRING, name: '订单名称', placeholder: '请输入订单名称' },
      { field: 'type', type: LIST, name: '交易类型', placeholder: '请选择交易类型', selectList: reconcileTradeList },
      { field: 'orderId', type: STRING, name: '本地订单', placeholder: '请输入本地订单ID' },
      { field: 'gatewayOrderNo', type: STRING, name: '网关订单号', placeholder: '请输入网关订单号' },
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
    reconcileTradeList = await dictDropDown('ReconcileTrade')
  }
  /**
   * 入口
   * @param record
   */
  function init(record) {
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
