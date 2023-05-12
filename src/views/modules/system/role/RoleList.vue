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
        <vxe-column field="code" title="编码" />
        <vxe-column field="name" title="名称" />
        <vxe-column field="remark" title="说明" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="210" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a href="javascript:" @click="show(row)">查看</a>
            </span>
            <a-divider type="vertical" />
            <span>
              <a href="javascript:" @click="edit(row)">编辑</a>
            </span>
            <a-divider type="vertical" />
            <a-popconfirm title="是否删除" @confirm="remove(row)" okText="是" cancelText="否">
              <a href="javascript:" style="color: red">删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 授权 <Icon icon="ant-design:down-outlined" :size="12" /> </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:" @click="handleRoleMenu(row)">菜单和权限码</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:" @click="handleRolePath(row)">请求资源</a>
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
      <role-edit ref="roleEdit" @ok="queryPage" />
      <role-menu-modal ref="roleMenuModal" />
      <role-path-modal ref="rolePathModal" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { del, page } from './Role.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import RoleEdit from './RoleEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import RoleMenuModal from "./RoleMenuModal.vue";
  import RolePathModal from "./RolePathModal.vue";

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { createMessage } = useMessage()

  const roleEdit = $ref<any>()
  const roleMenuModal = $ref<any>()
  const rolePathModal = $ref<any>()
  // 查询条件
  const fields = [
    { field: 'code', type: STRING, name: '角色编号', placeholder: '请输入角色编码' },
    { field: 'name', type: STRING, name: '角色名称', placeholder: '请输入角色名称' },
  ] as QueryField[]
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()

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
    roleEdit.init(null, FormEditType.Add)
  }
  // 查看
  function edit(record) {
    roleEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    roleEdit.init(record.id, FormEditType.Show)
  }
  // 菜单授权处理
  function handleRoleMenu(record) {
    roleMenuModal.init(record.id)
  }
  // 请求授权处理
  function handleRolePath(record) {
    rolePathModal.init(record.id)
  }
  // 删除
  function remove(record) {
    del(record.id).then(() => {
      createMessage.success('删除成功')
    })
    queryPage()
  }
</script>

<style lang="less" scoped></style>
