<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :default-item-count="3" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="date" title="对账日期" />
        <vxe-column field="batchNo" title="批次号" />
        <vxe-column field="channel" title="支付通道">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayChannel', row.channel) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="down" title="对账单下载">
          <template #default="{ row }">
            <a-tag v-if="row.down" color="green">已下载</a-tag>
            <a-link v-else color="red" @click="down(row)">下载</a-link>
          </template>
        </vxe-column>
        <vxe-column field="compare" title="对账单比对">
          <template #default="{ row }">
            <a-tag v-if="row.compare" color="green">已比对</a-tag>
            <a-link v-else :disabled="!row.down" color="red" @click="compare(row)">比对</a-link>
          </template>
        </vxe-column>
        <vxe-column field="errorMsg" title="错误信息" />
        <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link @click="showDetailPage(row)">对账明细</a-link>
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
    <reconcile-order-create ref="reconcileOrderCreate" @ok="queryPage" />
    <reconcile-detail-list ref="reconcileDetailList" />
    <reconcile-order-info ref="reconcileOrderInfo" />
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
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { downAndSave, page } from './ReconcileOrder.api'
  import ReconcileOrderInfo from './ReconcileOrderInfo.vue'
  import ReconcileDetailList from './ReconcileDetailList.vue'
  import ReconcileOrderCreate from '/@/views/payment/order/reconcile/ReconcileOrderCreate.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let payChannelList = $ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'date', type: DATE, name: '对账日期', placeholder: '请选择对账日期' },
      { field: 'batchNo', type: STRING, name: '批次号', placeholder: '请输入对账批次号' },
      {
        field: 'channel',
        type: LIST,
        name: '对账通道',
        placeholder: '请选择对账通道',
        selectList: payChannelList,
      },
    ] as QueryField[]
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const reconcileOrderCreate = $ref<any>()
  const reconcileOrderInfo = $ref<any>()
  const reconcileDetailList = $ref<any>()

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
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }
  /**
   * 查看详情
   */
  function show(record) {
    reconcileOrderInfo.init(record)
  }

  /**
   * 下载对账单
   */
  function down(record) {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: '确定要下载对账单吗？',
      onOk: () => {
        createMessage.info('对账单下载保存中.....')
        downAndSave(record.id).then(() => {
          createMessage.info('对账单下载完成')
          queryPage()
        })
      },
    })
  }

  /**
   * 对账明显比对
   */
  function compare(record) {
    createMessage.warn('下个版本支持...')
  }

  /**
   * 创建对账订单
   */
  function add() {
    reconcileOrderCreate.init()
  }

  /**
   * 查看明细列表
   */
  function showDetailPage(record) {
    reconcileDetailList.init(record)
  }
</script>

<style scoped lang="less"></style>
