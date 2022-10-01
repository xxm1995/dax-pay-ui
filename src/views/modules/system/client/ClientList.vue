<template>
  <div class="m-5 p-3 bg-white">
    <vxe-toolbar>
      <template #buttons>
        <vxe-button @click="getPage">查询</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table :data="model.tableData">
      <vxe-column type="seq" width="60" />
      <vxe-column field="code" title="编码" />
      <vxe-column field="name" title="名称" />
      <vxe-column field="captcha" title="系统内置">
        <template #default="{ row }">
          <a-tag v-if="row.system" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="enable" title="启用状态">
        <template #default="{ row }">
          <a-tag v-if="row.enable" color="green">启用</a-tag>
          <a-tag v-else color="red">停用</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="description" title="描述" />
      <vxe-column field="createTime" title="创建时间" />
    </vxe-table>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue'
  import { page } from '/@/views/modules/system/client/Client.api'

  onMounted(() => {
    getPage()
  })

  const model = reactive({
    loading: false,
    tableData: [] as any[],
  })

  async function getPage() {
    page({}).then((res) => {
      model.tableData = res.data.records
    })
  }
</script>

<style scoped></style>
