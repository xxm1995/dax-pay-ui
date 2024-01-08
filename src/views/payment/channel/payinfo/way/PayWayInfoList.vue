<template>
  <div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ query: queryPage }" />
      <vxe-table row-id="id" ref="xTable" :data="records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="code" title="通道编码" />
        <vxe-column field="name" title="支付通道名称" />
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
  </div>
</template>

<script setup lang="ts">
  import { VxeTable, VxeTableInstance, VxeToolbar, VxeToolbarInstance } from 'vxe-table'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from 'vue/macros'
  import { findAll, PayWayInfo } from './PayWayInfo.api'
  import { onMounted } from 'vue'
  import { getFilePreviewUrlPrefix } from '/@/api/common/FileUpload'
  import { FormEditType } from '/@/enums/formTypeEnum'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const payChannelConfigEdit = $ref<any>()

  let urlPrefix = $ref<string>()
  let records = $ref<PayWayInfo[]>([])

  onMounted(() => {
    vxeBind()
    initData()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    const result = await getFilePreviewUrlPrefix()
    urlPrefix = result.data
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
