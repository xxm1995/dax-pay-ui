<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="name" title="名称" />
        <vxe-column field="creatorName" v-if="hasPermission('22')" title="创建者名称" />
        <vxe-column field="remark" title="说明" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a-link @click="show(row)">查看</a-link>
            </span>
            <a-divider type="vertical" />
            <span>
              <a-link @click="edit(row)">编辑</a-link>
            </span>
            <a-divider type="vertical" />
            <a-popconfirm title="是否删除" @confirm="remove(row)" okText="是" cancelText="否">
              <a-link danger>删除</a-link>
            </a-popconfirm>
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
      <data-perm-demo-edit ref="dataPermDemoEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { del, page } from './DataPermDemo.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import DataPermDemoEdit from './DataPermDemoEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { usePermission } from '/@/hooks/web/usePermission'
  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { hasPermission } = usePermission()

  // 查询条件
  const fields = [
    { field: 'name', type: STRING, name: '名称', placeholder: '请输入名称' },
    { field: 'creatorName', type: STRING, name: '创建人', placeholder: '请输入创建人' },
    { field: 'remark', type: STRING, name: '备注', placeholder: '请输入备注' },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const dataPermDemoEdit = $ref<any>()

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
    dataPermDemoEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    dataPermDemoEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    dataPermDemoEdit.init(record.id, FormEditType.Show)
  }

  // 删除
  function remove(record) {
    del(record.id).then(() => {
      createMessage.success('删除成功')
      queryPage()
    })
  }
</script>

<style lang="less" scoped></style>
