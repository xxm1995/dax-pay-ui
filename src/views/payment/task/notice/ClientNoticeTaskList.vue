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
        <vxe-column field="orderId" title="本地交易号" width="170">
          <template #default="{ row }">
            <a-link @click="showOrder(row)">
              {{ row.orderNo }}
            </a-link>
          </template>
        </vxe-column>
        <vxe-column field="noticeType" title="消息类型">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('ClientNoticeType', row.noticeType) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="success" title="订单状态">
          <template #default="{ row }">
            <a-tag v-if="row.noticeType === 'pay'">{{ dictConvert('PayStatus', row.orderStatus) || '未知' }}</a-tag>
            <a-tag v-else>{{ dictConvert('RefundStatus', row.orderStatus) || '未知' }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="success" title="发送成功">
          <template #default="{ row }">
            <a-tag v-if="row.success" color="green">是</a-tag>
            <a-tag v-else color="red">否</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="sendCount" title="发送次数" sortable />
        <vxe-column field="latestTime" title="最后发送时间" sortable />
        <vxe-column field="url" title="发送地址" />
        <vxe-column field="createTime" title="创建时间" sortable />
        <vxe-column fixed="right" width="180" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link @click="showRecord(row)">记录列表</a-link>
            <a-divider type="vertical" />
            <a-link @click="resetSend(row)">重发</a-link>
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
    <client-notice-task-info ref="clientNoticeTaskInfo" />
    <client-notice-record-list ref="clientNoticeRecordList" />
    <pay-order-info ref="payOrderInfo" />
    <refund-order-info ref="refundOrderInfo" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { ClientNoticeTask, page, resetSendNotice } from './ClientNoticeTask.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { VxeTableInstance, VxeToolbarInstance, VxePager, VxeTable, VxeToolbar } from 'vxe-table'
  import ALink from '/@/components/Link/Link.vue'
  import ClientNoticeRecordList from './ClientNoticeRecordList.vue'
  import ClientNoticeTaskInfo from '/@/views/payment/task/notice/ClientNoticeTaskInfo.vue'
  import PayOrderInfo from '/@/views/payment/order/pay/PayOrderInfo.vue'
  import RefundOrderInfo from '/@/views/payment/order/refund/RefundOrderInfo.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, sortChange, resetQueryParams, pagination, pages, sortParam, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  // 查询条件
  const fields = computed(() => {
    return [{ field: 'orderId', type: STRING, name: '本地订单ID', placeholder: '请输入完整本地订单ID' }] as QueryField[]
  })

  const clientNoticeRecordList = $ref<any>()
  const clientNoticeTaskInfo = $ref<any>()
  const payOrderInfo = $ref<any>()
  const refundOrderInfo = $ref<any>()
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
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
  }

  /**
   * 重新发送消息
   */
  function resetSend(record: ClientNoticeTask) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否重新发送通知消息？',
      onOk: () => {
        loading.value = true
        resetSendNotice(record.id).then(({ data }) => {
          createMessage.success('请求已发送')
          queryPage()
        })
      },
    })
  }

  /**
   * 查看
   */
  function show(record) {
    clientNoticeTaskInfo.init(record)
  }
  /**
   * 查看记录列表
   */
  function showRecord(record) {
    clientNoticeRecordList.init(record)
  }
  /**
   * 查看订单信息
   */
  function showOrder(record: ClientNoticeTask) {
    if (record.noticeType === 'pay') {
      payOrderInfo.init(record.tradeNo)
    } else {
      refundOrderInfo.init(record.tradeNo)
    }
  }
</script>

<style lang="less" scoped></style>
