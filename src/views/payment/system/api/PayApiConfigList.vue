<template>
  <div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ query: queryPage }" />
      <vxe-table row-id="id" ref="xTable" :data="records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="code" title="编码" />
        <vxe-column field="name" title="名称" />
        <vxe-column field="api" title="接口地址" />
        <vxe-column field="enable" title="启用接口">
          <template #default="{ row }">
            <a-tag v-if="row.enable" color="green">启用</a-tag>
            <a-tag v-else color="red">停用</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="reqSign" title="参数签名">
          <template #default="{ row }">
            <a-tag v-if="row.reqSign" color="green">启用</a-tag>
            <a-tag v-else color="red">停用</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="notice" title="回调通知">
          <template #default="{ row }">
            <template v-if="row.noticeSupport">
              <a-tag v-if="row.notice" color="green">启用</a-tag>
              <a-tag v-else color="red">停用</a-tag>
            </template>
            <template v-else>
              <a-tag>不支持</a-tag>
            </template>
          </template>
        </vxe-column>
        <vxe-column field="noticeUrl" title="默认回调地址">
          <template #default="{ row }">
            <template v-if="row.noticeSupport">
              {{ row.noticeUrl }}
            </template>
            <template v-else> </template>
          </template>
        </vxe-column>
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
    <pay-api-config-edit ref="payApiConfigEdit" @ok="queryPage" />
  </div>
</template>

<script setup lang="ts">
  import { VxeTable, VxeTableInstance, VxeToolbar, VxeToolbarInstance } from 'vxe-table'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from 'vue/macros'
  import { findAll, PayApiConfig } from './PayApiConfig.api'
  import { onMounted } from 'vue'
  import { getFilePreviewUrlPrefix } from '/@/api/common/FileUpload'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import PayApiConfigEdit from './PayApiConfigEdit.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const payApiConfigEdit = $ref<any>()

  let urlPrefix = $ref<string>()
  let records = $ref<PayApiConfig[]>([])

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
    payApiConfigEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    payApiConfigEdit.init(record.id, FormEditType.Show)
  }
</script>

<style scoped lang="less"></style>
