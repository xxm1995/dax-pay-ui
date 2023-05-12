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
            <template v-if="[2, 3, 4].includes(row.type)">
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link"> 关联 <icon icon="ant-design:down-outlined" :size="12" /> </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item :disabled="![2, 4].includes(row.type)">
                      <a :disabled="![2, 4].includes(row.type) ? true : null" href="javascript:" @click="handleUserScope(row)">关联用户</a>
                    </a-menu-item>
                    <a-menu-item :disabled="![3, 4].includes(row.type)">
                      <a href="javascript:" :disabled="![3, 4].includes(row.type) ? true : null" @click="handleDeptScope(row)">关联部门</a>
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
      <data-scope-edit ref="dataScopeEdit" @ok="queryPage" />
      <dept-scope-modal ref="deptScopeModal" />
      <user-scope-modal ref="userScopeModal" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { del, page } from './DataScope.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import DataScopeEdit from './DataScopeEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import DeptScopeModal from './DeptScopeModal.vue'
  import UserScopeModal from './UserScopeModal.vue'
  import Icon from '/@/components/Icon/src/Icon.vue'

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
  const dataScopeEdit = $ref<any>()
  const deptScopeModal = $ref<any>()
  const userScopeModal = $ref<any>()

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
    dataScopeEdit.init(null, FormEditType.Add)
  }
  // 查看
  function edit(record) {
    dataScopeEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    dataScopeEdit.init(record.id, FormEditType.Show)
  }
  // 用户范围
  function handleUserScope(record) {
    userScopeModal.init(record.id)
  }
  // 部门范围
  function handleDeptScope(record) {
    deptScopeModal.init(record.id)
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
