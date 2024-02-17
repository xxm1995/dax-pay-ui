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
        <vxe-column field="status" title="异步支付方式">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('WalletStatus', row.status) || '无' }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间" sortable />
        <vxe-column fixed="right" width="200" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link @click="showChannel(row)">充值</a-link>
            <a-divider type="vertical" />
            <a-link @click="showChannel(row)">扣减</a-link>
            <a-divider type="vertical" />
            <a-link @click="showChannel(row)">流水</a-link>
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
    <create-wallet-model ref="createWalletModel" @ok="queryPage" />
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
  import CreateWalletModel from './CreateWalletModel.vue'

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

  let createWalletModel = $ref<any>()

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
    createWalletModel.init()
  }

  /**
   * 查看
   */
  function show(record) {}
  /**
   * 查看
   */
  function showChannel(record) {}
</script>

<style scoped lang="less"></style>
