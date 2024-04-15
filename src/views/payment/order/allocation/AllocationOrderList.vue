<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" :default-item-count="3" @query="queryPage" @reset="resetQueryParams" />
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
        <vxe-column field="allocationNo" title="分账单号" />
        <vxe-column field="title" title="订单标题" />
        <vxe-column field="paymentId" title="支付订单ID" />
        <vxe-column field="channel" title="所属通道">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayChannel', row.channel) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="amount" title="总分账金额">
          <template #default="{ row }"> {{ row.amount / 100.0 }}元 </template>
        </vxe-column>
        <vxe-column field="status" title="状态">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('AllocationStatus', row.status) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="errorMsg" title="错误原因" />
        <vxe-column field="finishTime" title="完成时间" />
        <vxe-column fixed="right" width="200" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link @click="showDetail(row)">明细列表</a-link>
            <a-divider type="vertical" />
            <a-dropdown>
              <a>
                更多
                <icon icon="ant-design:down-outlined" :size="12" />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-link @click="syncInfo(row)">同步</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="finishInfo(row)">完结</a-link>
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
    </div>
    <allocation-order-info ref="allocationOrderInfo" />
    <allocation-order-detail-list ref="allocationOrderDetailList" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page, findChannels, sync, finish } from "./AllocationOrder.api";
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useDict } from '/@/hooks/bootx/useDict'
  import ALink from '/@/components/Link/Link.vue'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import AllocationOrderDetailList from './AllocationOrderDetailList.vue'
  import AllocationOrderInfo from './AllocationOrderInfo.vue'
  import { PayStatus } from "/@/enums/payment/PayStatus";

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, sortChange, sortParam, pages, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const allocationOrderDetailList = $ref<any>()
  const allocationOrderInfo = $ref<any>()

  let payChannelList = $ref<LabeledValue[]>([])

  const fields = computed(() => {
    return [
      { field: 'channel', type: LIST, name: '分账通道', placeholder: '请选择分账通道', selectList: payChannelList },
      { field: 'orderNo', type: STRING, name: '分账订单号', placeholder: '请输入分账订单号' },
      { field: 'paymentId', type: STRING, name: '支付订单ID', placeholder: '请输入支付订单ID' },
      { field: 'title', type: STRING, name: '支付订单标题', placeholder: '请输入支付订单标题' },
      { field: 'allocationNo', type: STRING, name: '分账业务号', placeholder: '请输入分账业务号' },
    ] as QueryField[]
  })
  onMounted(() => {
    vxeBind()
    initData()
    queryPage()
  })

  /**
   * 绑定
   */
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    findChannels().then(({ data }) => (payChannelList = data))
  }

  /**
   * 查看
   */
  function show(record) {
    allocationOrderInfo.init(record, FormEditType.Show)
  }

  /**
   * 查询分账明细列表
   * @param record
   */
  function showDetail(record) {
    allocationOrderDetailList.init(record)
  }

  /**
   * 同步分账状态
   * @param record
   */
  function syncInfo(record) {
    createConfirm({
      iconType: 'info',
      title: '同步分账状态',
      content: '确定同步分账状态吗？',
      onOk: () => {
        sync(record.id).then(() => {
          createMessage.success('同步成功')
          queryPage()
        })
      },
    })
  }

  /**
   * 完结分账
   */
  function finishInfo(record) {
    createConfirm({
      iconType: 'info',
      title: '完结分账',
      content: '确定完结分账吗？',
      onOk: () => {
        finish(record.id).then(() => {
          createMessage.success('完结请求发送成功')
          queryPage()
        })
      },
    })
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
</script>

<style scoped lang="less"></style>
