<template>
  <div class="m-5 p-3 bg-white">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="编码">
              <a-input v-model="queryParam.code" placeholder="请输入编码" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder="请输入名称" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-space>
              <a-button type="primary" @click="query">查询</a-button>
              <a-button @click="resetQuery">重置</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <vxe-toolbar>
      <template #buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
        <a-button @click="getPage">查询</a-button>
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
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, toRefs } from 'vue'
  import { page } from '/@/views/modules/system/client/Client.api'
  import { PageResult } from '/#/axios'
  // 初始化
  function init() {
    getPage()
  }

  onMounted(() => {
    init()
  })

  const pageParam = reactive({
    size: 10,
    current: 1,
  })
  const queryParam = reactive({})
  const model = reactive({
    loading: false,
    pagination: { size: 10, current: 1, total: 0, records: [] } as PageResult,
  })
  const { loading, pagination } = toRefs(model)
  // 分页
  function getPage() {
    model.loading = true
    page({
      ...queryParam,
      ...pageParam,
    }).then(({ data }) => {
      model.pagination = data
      model.loading = false
    })
  }
  // 页面变动
  function handleTableChange({ currentPage, pageSize }) {
    pageParam.current = currentPage
    pageParam.size = pageSize
    init()
  }
</script>

<style scoped></style>
