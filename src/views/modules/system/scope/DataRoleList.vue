<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :default-item-md="8" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
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
        <vxe-column field="type" title="类型">
          <template #default="{ row }">
            {{ dictConvert('DataScopePerm', row.type) }}
          </template>
        </vxe-column>
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
            <template v-if="['user', 'dept', 'dept_and_user'].includes(row.type)">
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link"> 关联 <icon icon="ant-design:down-outlined" :size="12" /> </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-if="['user', 'dept_and_user'].includes(row.type)">
                      <a href="javascript:" @click="handleUserScope(row)">关联用户</a>
                    </a-menu-item>
                    <a-menu-item v-if="['dept', 'dept_and_user'].includes(row.type)">
                      <a href="javascript:" @click="handleDeptScope(row)">关联部门</a>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
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
      <data-role-edit ref="dataRoleEdit" @ok="queryPage" />
      <dept-role-modal ref="deptRoleModal" />
      <user-role-modal ref="userRoleModal" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { $ref } from 'vue/macros'
  import { del, page } from './DataRole.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import DataRoleEdit from './DataRoleEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import DeptRoleModal from './DeptRoleModal.vue'
  import UserRoleModal from './UserRoleModal.vue'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import ALink from "/@/components/Link/Link.vue";

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage } = useMessage()
  const { dictConvert } = useDict()

  // 查询条件
  const fields = [
    { field: 'code', type: STRING, name: '编码', placeholder: '请输入权限编码' },
    { field: 'name', type: STRING, name: '名称', placeholder: '请输入权限名称' },
  ]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const dataRoleEdit = $ref<any>()
  const deptRoleModal = $ref<any>()
  const userRoleModal = $ref<any>()

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
    dataRoleEdit.init(null, FormEditType.Add)
  }
  // 查看
  function edit(record) {
    dataRoleEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    dataRoleEdit.init(record.id, FormEditType.Show)
  }
  // 用户范围
  function handleUserScope(record) {
    userRoleModal.init(record.id)
  }
  // 部门范围
  function handleDeptScope(record) {
    deptRoleModal.init(record.id)
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
