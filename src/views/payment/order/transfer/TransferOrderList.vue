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
          <span style="font-size: 18px">转账金额: {{ totalAmount ? (totalAmount / 100).toFixed(2) : 0 }}元</span>
        </template>
      </vxe-toolbar>
      <vxe-table
        row-id="id"
        ref="xTable"
        :sort-config="{ remote: true, trigger: 'cell' }"
        :data="pagination.records"
        :loading="loading"
        @sort-change="sortChange"
      >
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="transferNo" title="转账号" :min-width="230">
          <template #default="{ row }">
            <a @click="show(row)">
              {{ row.transferNo }}
            </a>
          </template>
        </vxe-column>
        <vxe-column field="bizTransferNo" title="商户转账号" :min-width="230" />
        <vxe-column field="title" title="标题" :min-width="160" />
        <vxe-column field="channel" title="转账通道" :min-width="120">
          <template #default="{ row }">
            {{ dictConvert('PayChannel', row.channel) }}
          </template>
        </vxe-column>
        <vxe-column field="amount" title="金额(元)" :min-width="140">
          <template #default="{ row }"> {{ row.amount ? (row.amount / 100).toFixed(2) : 0 }} </template>
        </vxe-column>
        <vxe-column field="status" title="状态" :min-width="80">
          <template #default="{ row }">
            {{ dictConvert('TransferStatus', row.status) }}
          </template>
        </vxe-column>
        <vxe-column field="reason" title="转账原因" :min-width="160" />
        <vxe-column field="createTime" title="创建时间" sortable :min-width="230" />
        <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link @click="sync(row)">同步</a-link>
            <a-divider type="vertical" />
            <a-link @click="reset(row)">重试</a-link>
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
      <transfer-order-info ref="transferOrderInfo" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { getTotalAmount, page, resetTransfer, syncByTransferNo } from './TransferOrder.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import TransferOrderInfo from './TransferOrderInfo.vue'
  import { VxeTable, VxeTableInstance, VxeToolbar, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import ALink from '/@/components/Link/Link.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, sortChange, sortParam, pagination, pages, model, loading } =
    useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let channelList = $ref<LabeledValue[]>([])
  let transferStatusList = $ref<LabeledValue[]>([])
  let totalAmount = $ref<number>(0.0)

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'bizTransferNo', type: STRING, name: '商户退款号', placeholder: '请输入商户退款号' },
      { field: 'transferNo', type: STRING, name: '退款号', placeholder: '请输入退款号' },
      { field: 'outTransferNo', type: STRING, name: '通道退款号', placeholder: '请输入通道退款号' },
      { field: 'title', type: STRING, name: '原支付标题', placeholder: '请输入转账标题' },
      { field: 'payeeName', type: STRING, name: '收款人姓名', placeholder: '请输入收款人姓名' },
      { field: 'errorCode', name: '错误码', type: STRING },
      {
        field: 'status',
        type: LIST,
        name: '处理状态',
        placeholder: '请选择处理状态',
        selectList: transferStatusList,
      },
      { field: 'channel', name: '转账通道', type: LIST, selectList: channelList },
    ] as QueryField[]
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const transferOrderInfo = $ref<any>()

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
    transferStatusList = await dictDropDown('TransferStatus')
    channelList = await dictDropDown('PayChannel')
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
      totalAmount = data
    })
    return Promise.resolve()
  }

  /**
   * 信息同步
   */
  function sync(record) {
    createMessage.warn('下版本支持...')
  }

  /**
   * 退款重试
   */
  function reset(record) {
    createMessage.warn('下版本支持...')
  }

  /**
   * 查看
   */
  function show(record) {
    transferOrderInfo.init(record.bizTransferNo)
  }
</script>

<style lang="less" scoped></style>
