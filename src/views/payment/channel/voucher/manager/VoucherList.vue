<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-button type="primary" @click="importCard">导入储值卡</a-button>
        </template>
      </vxe-toolbar>
      <vxe-table
        row-id="id"
        ref="xTable"
        :data="pagination.records"
        :loading="loading"
        :sort-config="{ remote: true, trigger: 'cell' }"
        @sort-change="sortChange"
      >
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="id" title="卡ID" width="170" />
        <vxe-column field="cardNo" title="卡号" />
        <vxe-column field="faceValue" title="面值(分)" sortable />
        <vxe-column field="balance" title="余额(分)" sortable />
        <vxe-column field="enduring" title="是否长期有效">
          <template #default="{ row }">
            <a-tag>{{ row.enduring ? '长期' : '期限' }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="startTime" title="开始时间" sortable />
        <vxe-column field="endTime" title="结束时间" sortable />
        <vxe-column field="status" title="状态">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('VoucherStatus', row.status) || '无' }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间" sortable />
        <vxe-column fixed="right" width="100" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link @click="showRecord(row)">流水</a-link>
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
    <voucher-import-model ref="voucherImportModel" @ok="queryPage" />
    <voucher-record-list ref="voucherRecordList" />
    <voucher-info ref="voucherInfo" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page } from './Voucher.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { VxeTableInstance, VxeToolbarInstance, VxePager, VxeTable, VxeToolbar } from 'vxe-table'
  import ALink from '/@/components/Link/Link.vue'
  import VoucherImportModel from './VoucherImportModel.vue'
  import VoucherInfo from './VoucherInfo.vue'
  import VoucherRecordList from '/@/views/payment/channel/voucher/record/VoucherRecordList.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, sortChange, resetQueryParams, pagination, pages, sortParam, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'walletId', type: STRING, name: '钱包ID', placeholder: '请输入完整钱包ID' },
      { field: 'userId', type: STRING, name: '用户ID', placeholder: '请输入完整用户ID' },
    ] as QueryField[]
  })

  const voucherImportModel = $ref<any>()
  const voucherRecordList = $ref<any>()
  const voucherInfo = $ref<any>()

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
      ...sortParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }

  /**
   * 导入储值卡
   */
  function importCard() {
    voucherImportModel.init()
  }

  /**
   * 查看
   */
  function show(record) {
    voucherInfo.init(record)
  }

  /**
   * 查看记录
   */
  function showRecord(record) {
    voucherRecordList.init(record)
  }
</script>

<style scoped lang="less"></style>
