<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" :default-item-count="3" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
            <a-button @click="showDatabaseList">数据源列表</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="code" title="编码" />
        <vxe-column field="name" title="名称" />
        <vxe-column field="databaseType" title="数据库类型">
          <template #default="{ row }">
            <a-tag> {{ dictConvert('DatabaseType', row.databaseType) }} </a-tag>
          </template>
        </vxe-column>
        <vxe-column field="dbDriver" title="驱动类" />
        <vxe-column field="dbUrl" title="连接地址" />
        <vxe-column field="dbUsername" title="用户名" />
        <vxe-column field="autoLoad" title="自动加载">
          <template #default="{ row }">
            <a-tag v-if="row.autoLoad" color="green">是</a-tag>
            <a-tag v-else color="red">否</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="160" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link @click="edit(row)">编辑</a-link>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /> </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-link @click="testConnectionInfo(row)">测试连接</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="addDynamicDataSource(row)">应用</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link danger @click="remove(row)">删除</a-link>
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
      <dynamic-data-source-edit ref="dynamicDataSourceEdit" @ok="queryPage" />
      <data-source-list ref="dataSourceList" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { addDynamicDataSourceById, databaseTypes, del, existsByDataSourceKey, page, testConnectionById } from './DynamicDataSource.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import DynamicDataSourceEdit from './DynamicDataSourceEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import DataSourceList from './DataSourceList.vue'
  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()
  // 查询条件
  const fields = [
    { field: 'code', type: 'string', name: '编码', placeholder: '请输入编码' },
    { field: 'name', type: 'string', name: '名称', placeholder: '请输入名称' },
    {
      field: 'databaseType',
      type: 'list',
      name: '数据库类型',
      selectList: databaseTypes,
      placeholder: '请选择数据库类型',
    },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const dynamicDataSourceEdit = $ref<any>()
  const dataSourceList = $ref<any>()

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
  // 新增
  function add() {
    dynamicDataSourceEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    dynamicDataSourceEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    dynamicDataSourceEdit.init(record.id, FormEditType.Show)
  }
  // 查看数据源列表
  function showDatabaseList() {
    dataSourceList.show()
  }
  // 测试连接
  async function testConnectionInfo(record) {
    const { data } = await testConnectionById(record.id)
    if (data) {
      createMessage.warn(data)
    } else {
      createMessage.success('连接成功')
    }
  }
  // 应用到系统中
  async function addDynamicDataSource(record) {
    const { data } = await existsByDataSourceKey(record.code)
    if (data) {
      createConfirm({
        iconType: 'warning',
        title: '重新添加',
        content: '该数据源配置已经应用，是否进行更新',
        onOk: () => {
          addDynamicDataSourceById(record.id).then(() => {
            createMessage.success('更新成功')
          })
        },
      })
    } else {
      createConfirm({
        iconType: 'warning',
        title: '添加',
        content: '是否将该数据源配置应用到系统中',
        onOk: () => {
          addDynamicDataSourceById(record.id).then(() => {
            createMessage.success('应用成功')
          })
        },
      })
    }
  }
  // 删除
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '删除',
      content: '是否删除动态表单',
      onOk: () => {
        loading.value = true
        del(record.id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }
</script>

<style lang="less" scoped></style>
