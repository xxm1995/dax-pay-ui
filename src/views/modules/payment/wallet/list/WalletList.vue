<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:usergroup-add" @click="add">开通钱包</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="userId" title="用户ID" />
        <vxe-column field="id" title="钱包ID" />
        <vxe-column field="balance" title="余额" />
        <vxe-column field="payStatus" title="状态">
          <template #default="{ row }">
            {{ dictConvert('WalletStatus', row.status) }}
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="120" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a-link @click="show(row)">查看</a-link>
            </span>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /> </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-link danger v-if="row.status === 1" @click="lockConfirm(row.id, true)">锁定钱包</a-link>
                    <a-link v-if="row.status === 2" @click="lockConfirm(row.id, false)">解锁钱包</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="showLog(row.id)">钱包日志</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="recharge(row.id)">金额变动</a-link>
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
      <wallet-info ref="walletInfo" />
      <wallet-changer ref="walletChanger" @ok="queryPage" />
      <wallet-log-list ref="walletLogList" />
      <b-user-select-modal ref="userSelectModal" multiple :data-source="pageByNotWallet" @ok="createBatchWallet" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { createWalletBatch, del, lock, page, pageByNotWallet, unlock } from './Wallet.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import WalletInfo from './WalletInfo.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import BUserSelectModal from '/@/components/Bootx/UserSelectModal/BUserSelectModal.vue'
  import WalletLogList from './WalletLogList.vue'
  import WalletChanger from './WalletChanger.vue'
  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()
  // 查询条件
  const fields = [
    { field: 'walletId', type: STRING, name: '钱包ID', placeholder: '请输入钱包ID' },
    { field: 'userId', type: STRING, name: '用户ID', placeholder: '请输入用户ID' },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const walletInfo = $ref<any>()
  const userSelectModal = $ref<any>()
  const walletLogList = $ref<any>()
  const walletChanger = $ref<any>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  // 分页查询
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
  // 开通钱包
  function add() {
    userSelectModal.init()
  }
  // 查看
  function show(record) {
    walletInfo.init(record.id)
  }
  // 批量开通钱包
  function createBatchWallet(userIds: string[]) {
    loading.value = true
    createMessage.success('批量开通钱包中')
    createWalletBatch(userIds).then(() => queryPage())
  }
  // 钱包日志
  function showLog(walletId) {
    walletLogList.init(walletId)
  }
  // 调整余额
  function recharge(walletId) {
    walletChanger.init(walletId)
  }
  /**
   * 锁定/解锁 钱包
   * @param walletId 钱包id
   * @param type true 锁定, false 解锁
   */
  function lockConfirm(walletId, type) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: type ? '是否锁定该钱包' : '是否解锁该钱包',
      onOk: async () => {
        if (type) {
          await lock(walletId)
        } else {
          await unlock(walletId)
        }
        createMessage.success(type ? '锁定钱包成功' : '解锁该钱包成功')
        queryPage()
      },
    })
  }
</script>

<style lang="less" scoped></style>
