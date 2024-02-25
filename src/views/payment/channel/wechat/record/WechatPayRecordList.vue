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
        <vxe-column field="title" title="标题" />
        <vxe-column field="type" title="类型">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('WechatPayRecordType', row.type) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="amount" title="金额" />
        <vxe-column field="orderId" title="本地订单ID" width="170" />
        <vxe-column field="gatewayOrderNo" title="网关订单号" width="170" />
        <vxe-column field="createTime" title="记录时间" sortable />
        <vxe-column fixed="right" width="50" :showOverflow="false" title="操作">
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
      <wechatPay-record-info ref="wechatPayRecordInfo" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page, WechatPayRecord } from './WechatPayRecord.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useDict } from '/@/hooks/bootx/useDict'
  import WechatPayRecordInfo from './WechatPayRecordInfo.vue'
  import ALink from '/@/components/Link/Link.vue'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { STRING } from '/@/components/Bootx/Query/Query'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, sortChange, sortParam, pages, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let wechatPayRecordInfo = $ref<any>()

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()

  const fields = [
    { field: 'title', type: STRING, name: '标题', placeholder: '请输入标题' },
    { field: 'orderId', type: STRING, name: '本地订单ID', placeholder: '请输入完整本地订单ID' },
    { field: 'gatewayOrderNo', type: STRING, name: '网关订单号', placeholder: '请输入完整网关订单号' },
  ]
  onMounted(() => {
    vxeBind()
    queryPage()
  })

  /**
   * 绑定
   */
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 查看
   */
  function show(record) {
    wechatPayRecordInfo.init(record)
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
