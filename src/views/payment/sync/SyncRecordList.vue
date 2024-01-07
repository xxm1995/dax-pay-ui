<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="paymentId" title="支付记录id" />
        <vxe-column field="payChannel" title="支付通道">
          <template #default="{ row }">
            {{ dictConvert('PayChannel', row.payChannel) }}
          </template>
        </vxe-column>
        <vxe-column field="status" title="处理状态">
          <template #default="{ row }">
            {{ dictConvert('PaySyncStatus', row.status) }}
          </template>
        </vxe-column>
        <vxe-column field="msg" title="提示信息" />
        <vxe-column field="syncTime" title="同步时间" />
        <vxe-column fixed="right" width="50" :showOverflow="false" title="操作">
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
      <sync-record-info ref="syncRecordInfo" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page } from './SyncRecord.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import SyncRecordInfo from './SyncRecordInfo.vue'
  import { VxeTableInstance, VxeToolbarInstance, VxeTable, VxeColumn, VxePager, VxeToolbar } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  // 查询条件
  const fields = [
    { field: 'paymentId', type: STRING, name: '支付单号', placeholder: '请输入支付单号' },
    {
      field: 'payChannel',
      type: LIST,
      name: '支付通道',
      placeholder: '请选择支付通道',
      selectList: dictDropDown('AsyncPayChannel'),
    },
    {
      field: 'status',
      type: LIST,
      name: '处理状态',
      placeholder: '请选择处理状态',
      selectList: dictDropDown('PaySyncStatus'),
    },
    { field: 'mchCode', type: STRING, name: '商户编码', placeholder: '请输入商户编码' },
    { field: 'mchAppCode', type: STRING, name: '应用号编码', placeholder: '请输入商户编码' },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const syncRecordInfo = $ref<any>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })

  /**
   * 初始化绑定
   */
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
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }

  /**
   * 查看
   */
  function show(record) {
    syncRecordInfo.init(record.id)
  }
</script>

<style lang="less" scoped></style>
