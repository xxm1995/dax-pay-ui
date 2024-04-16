<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-button type="primary" @click="create">钱包开通</a-button>
        </template>
      </vxe-toolbar>
      <vxe-table
        row-id="id"
        ref="xTable"
        :cell-style="cellStyle"
        :data="pagination.records"
        :loading="loading"
        :sort-config="{ remote: true, trigger: 'cell' }"
        @sort-change="sortChange"
      >
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="id" title="钱包ID" width="170" />
        <vxe-column field="userId" title="用户ID" />
        <vxe-column field="name" title="钱包名称" />
        <vxe-column field="balance" title="余额(分)" sortable />
        <vxe-column field="status" title="状态">
          <template #default="{ row }">
            {{ dictConvert('WalletStatus', row.status) || '无' }}
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间" sortable />
        <vxe-column fixed="right" width="200" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link @click="showRecharge(row)">充值</a-link>
            <a-divider type="vertical" />
            <a-link @click="showDeduction(row)">扣减</a-link>
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
    <wallet-info ref="walletInfo" />
    <wallet-create-model ref="walletCreateModel" @ok="queryPage" />
    <wallet-deduct-model ref="walletDeductModel" @ok="queryPage" />
    <wallet-recharge-model ref="walletRechargeModel" @ok="queryPage" />
    <wallet-record-list ref="walletRecordList" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page } from './Wallet.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { VxeTableInstance, VxeToolbarInstance, VxePager, VxeTable, VxeToolbar } from 'vxe-table'
  import ALink from '/@/components/Link/Link.vue'
  import WalletCreateModel from './WalletCreateModel.vue'
  import WalletRecordList from '../record/WalletRecordList.vue'
  import WalletRechargeModel from './WalletRechargeModel.vue'
  import WalletDeductModel from './WalletDeductModel.vue'
  import WalletInfo from './WalletInfo.vue'

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

  let walletInfo = $ref<any>()
  let walletCreateModel = $ref<any>()
  let walletDeductModel = $ref<any>()
  let walletRechargeModel = $ref<any>()
  let walletRecordList = $ref<any>()

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
   * 开通钱包
   */
  function create() {
    walletCreateModel.init()
  }

  /**
   * 查看
   */
  function show(record) {
    walletInfo.init(record)
  }

  /**
   * 充值
   */
  function showRecharge(record) {
    walletRechargeModel.init(record.id)
  }

  /**
   * 扣减
   */
  function showDeduction(record) {
    walletDeductModel.init(record.id)
  }
  /**
   * 流水
   */
  function showRecord(record) {
    walletRecordList.init(record)
  }
  function cellStyle({ row, column }) {
    if (column.field == 'status') {
      if (row.status == 'normal') {
        return { color: 'green' }
      }
      if (row.status == 'forbidden') {
        return { color: 'red' }
      }
      return { color: 'gray' }
    }
    
  }
</script>

<style scoped lang="less"></style>
