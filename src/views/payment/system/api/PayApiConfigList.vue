<template>
  <div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ query: queryPage }" />
      <vxe-table row-id="id" ref="xTable" :data="records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="name" title="名称" :min-width="170" />
        <vxe-column field="code" title="编码" :min-width="170" />
        <vxe-column field="api" title="接口地址" :min-width="280" />
        <vxe-column field="remark" title="备注" :min-width="280" />
        <vxe-column field="enable" title="启用接口" fixed="right" :width="80">
          <template #default="{ row }">
            <a-switch checked-children="启用" un-checked-children="停用" v-model:checked="row.enable" @change="edit(row)" />
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { VxeTable, VxeTableInstance, VxeToolbar, VxeToolbarInstance } from 'vxe-table'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from 'vue/macros'
  import { findAll, PayApiConfig, update } from './PayApiConfig.api'
  import { onMounted } from 'vue'

  // 使用hooks
  const { loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const payApiConfigEdit = $ref<any>()

  let records = $ref<PayApiConfig[]>([])

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

  /**
   * 更新
   */
  function edit(row: PayApiConfig) {
    loading.value = true
    update(row).then(() => {
      createMessage.success('更新成功')
      queryPage()
    })
  }
</script>

<style scoped lang="less"></style>
