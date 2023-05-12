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
        <vxe-column field="name" title="表单名称" />
        <vxe-column field="code" title="表单编码" />
        <vxe-column field="remark" title="备注" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="240" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a href="javascript:" @click="show(row)">查看</a>
            </span>
            <a-divider type="vertical" />
            <span>
              <a href="javascript:" @click="edit(row)">编辑</a>
            </span>
            <a-divider type="vertical" />
            <span>
              <a href="javascript:" @click="design(row.id)">表单设计</a>
            </span>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /> </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:" @click="preview(row.id)">预览表单</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:">配置地址</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:" @click="remove(row)" style="color: red">删除</a>
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
      <dynamic-form-edit ref="dynamicFormEdit" @ok="queryPage" />
      <dynamic-design ref="dynamicDesign" />
      <dynamic-preview ref="dynamicPreview" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { del, page } from './DynamicForm.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import DynamicFormEdit from './DynamicFormEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import DynamicDesign from '/@/views/modules/develop/dynamicform/DynamicDesign.vue'
  import DynamicPreview from '/@/views/modules/develop/dynamicform/DynamicPreview.vue'
  import Icon from '/@/components/Icon/src/Icon.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createConfirm } = useMessage()

  // 查询条件
  const fields = [
    { field: 'code', type: 'string', name: '编码', placeholder: '请输入编码' },
    { field: 'name', type: 'string', name: '名称', placeholder: '请输入名称' },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const dynamicFormEdit = $ref<any>()
  const dynamicDesign = $ref<any>()
  const dynamicPreview = $ref<any>()

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
    dynamicFormEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    dynamicFormEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    dynamicFormEdit.init(record.id, FormEditType.Show)
  }

  // 设计
  function design(record) {}
  // 预览
  function preview(record) {}

  // 删除
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否删除该表单',
      onOk: () => {
        del(record.id).then(() => {
          notification.success({ message: '删除成功' })
          queryPage()
        })
      },
    })
  }
</script>

<style lang="less" scoped></style>
