<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :default-item-count="3" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
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
        <vxe-column field="amount" title="交易金额" />
        <vxe-column field="orderTime" title="订单时间" />
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
    </div>
  </div>
</template>
<script setup lang="ts">
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { computed, onMounted } from 'vue'
  import { DATE, LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { page } from './ReconcileDiff.api'
  import ReconcileDiffInfo from './ReconcileDiffInfo.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, sortChange, sortParam, pagination, pages, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let payChannelList = $ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'title', type: DATE, name: '订单标题', placeholder: '请输入订单标题' },
    ] as QueryField[]
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const reconcileDiffInfo = $ref<any>()

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
    payChannelList = await dictDropDown('AsyncPayChannel')
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
   * 查看详情
   */
  function show(record) {
    reconcileDiffInfo.init(record)
  }
</script>

<style scoped lang="less"></style>
