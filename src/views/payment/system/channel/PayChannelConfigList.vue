<template>
  <div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ query: queryPage }" />
      <vxe-table row-id="id" ref="xTable" :data="records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="code" title="通道编码" />
        <vxe-column field="name" title="支付通道名称" />
        <vxe-column field="remark" title="备注" />
        <vxe-column fixed="right" width="100" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a-link @click="show(row)">查看</a-link>
            </span>
            <a-divider type="vertical" />
            <span>
              <a-link @click="edit(row)">编辑</a-link>
            </span>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <pay-channel-config-edit ref="payChannelConfigEdit" @ok="queryPage" />
  </div>
</template>
<script setup lang="ts">
  import { VxeTable, VxeTableInstance, VxeToolbar, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { findAll, PayChannelConfig } from './ChannelConfig.api'
  import { onMounted } from 'vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { $ref } from 'vue/macros'
  import PayChannelConfigEdit from './PayChannelConfigEdit.vue'

  // 使用hooks
  const { loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const payChannelConfigEdit = $ref<any>()

  let records = $ref<PayChannelConfig[]>([])

  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 数据查询
   */
  function queryPage() {
    loading.value = true
    findAll().then(({ data }) => {
      records = data
      loading.value = false
    })
    return Promise.resolve()
  }
  // 编辑
  function edit(record) {
    payChannelConfigEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    payChannelConfigEdit.init(record.id, FormEditType.Show)
  }
</script>

<style scoped lang="less"></style>
