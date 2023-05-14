<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="tableName" title="表名称" />
        <vxe-column field="dataName" title="数据名称" />
        <vxe-column field="dataId" title="数据主键" />
        <vxe-column field="version" title="数据版本" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="60" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a href="javascript:" @click="show(row)">查看</a>
            </span>
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
      <data-version-log-edit ref="dataVersionLogEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page } from './DataVersionLog.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import DataVersionLogEdit from './DataVersionLogInfo.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { NUMBER, QueryField, STRING } from '/@/components/Bootx/Query/Query'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage } = useMessage()

  // 查询条件
  const fields = [
    { field: 'dataName', type: STRING, name: '数据名称', placeholder: '请输入数据名称' },
    { field: 'tableName', type: STRING, name: '表名称', placeholder: '请输入表名称' },
    { field: 'dataId', type: STRING, name: '数据主键', placeholder: '请输入数据主键' },
    { field: 'version', type: NUMBER, name: '数据版本', placeholder: '请输入数据版本' },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const dataVersionLogEdit = $ref<any>()

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
  // 查看
  function show(record) {
    dataVersionLogEdit.init(record.id)
  }
</script>

<style lang="less" scoped></style>
