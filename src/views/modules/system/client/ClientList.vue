<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar>
        <template #buttons>
          <a-space>
            <a-button type="primary" @click="add">新建</a-button>
            <a-button @click="queryPage">查询</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" :data="pagination.records" :loading="loading">
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
      <vxe-pager
        size="medium"
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
      <client-edit ref="clientEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { page } from '/@/views/modules/system/client/Client.api'
  import useTable from '/@/hooks/bootx/useTable'
  import ClientEdit from './ClientEdit.vue'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { STRING } from '/@/components/Bootx/Query/SuperQueryCode'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTable(queryPage)
  const clientEdit = ref()

  // 查询条件
  const fields = [
    { field: 'code', type: STRING, name: '编码', placeholder: '请输入数据源编码' },
    { field: 'name', type: STRING, name: '名称', placeholder: '请输入数据源名称' },
  ]

  onMounted(() => {
    queryPage()
  })

  // 分页查询
  function queryPage() {
    model.loading = true
    page({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
  // 新增
  function add() {
    clientEdit.value.visible = true
  }
</script>

<style lang="less" scoped></style>
