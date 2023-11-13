<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :query-params="model.queryParam"
        :fields="fields"
        :defaultItemCount="fields.length"
        @query="queryPage"
        @reset="resetQueryParams"
      />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom zoom :refresh="{ queryMethod: queryPage }" />
      <vxe-table ref="xTable" row-id="id" :loading="loading" :data="pagination.records">
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="tableName" title="表名称" />
        <vxe-column field="engine" title="引擎类型" />
        <vxe-column field="tableComment" title="表表述" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="120" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <!--          <a href="javascript:" @click="previewShow(row)">预览</a>-->
            <!--          <a-divider type="vertical" />-->
            <a href="javascript:" @click="generateShow(model.queryParam.dataSourceCode, row)">生成</a>
          </template>
        </vxe-column>
      </vxe-table>
      <vxe-pager
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
      <code-gen-form ref="codeGenForm" @down="generate" @preview="preview" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import CodeGenForm from './CodeGenForm.vue'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { $ref } from 'vue/macros'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { onMounted } from 'vue'
  import { codeGenPreview, DataSource, genCodeZip, page } from './CodeGen.api'
  import { downloadByData } from '/@/utils/file/download'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { findAllDataSource } from '/@/views/modules/develop/dynamicsource/DynamicDataSource.api'

  const { handleTableChange, resetQueryParams, pageQueryResHandel, pagination, pages, model, loading } = useTablePage(queryPage)
  // 查询条件

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  let codeGenForm = $ref<any>()
  let dataSources = $ref([] as DataSource[])

  const fields = [
    { field: 'tableName', type: STRING, name: '名称', placeholder: '请输入表名称' },
    { field: 'tableComment', type: STRING, name: '描述', placeholder: '请输入表描述' },
    { field: 'dataSourceCode', type: LIST, name: '数据库源', placeholder: '选择所需数据源', selectList: dataSources },
  ] as QueryField[]

  onMounted(() => {
    vxeBind()
    initDataSource()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  // 初始化和获取数据源列表
  function initDataSource() {
    model.queryParam.dataSourceCode = 'master'
    findAllDataSource().then(({ data }) => {
      data.forEach((item) => {
        dataSources.push({ label: item.key, value: item.key })
      })
    })
  }

  // 分页查询
  async function queryPage() {
    loading.value = true
    await page({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }

  // 预览代码
  function preview(from) {
    codeGenPreview(from).then((res) => {
      console.log(res.data)
    })
  }
  // 打开预览
  function generateShow(dataSourceName, record) {
    codeGenForm.show(dataSourceName, record.tableName, 'down')
  }
  // 生成代码
  function generate(from) {
    genCodeZip(from).then((response) => {
      downloadByData(response, from.tableName + '.zip')
    })
  }
</script>

<style scoped></style>
