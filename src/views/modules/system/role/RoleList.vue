<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <a-form class="page-query" layout="inline">
        <a-row :gutter="10">
          <a-col :md="8" :sm="24">
            <a-form-item label="查询">
              <a-input-search
                v-model:value="searchName"
                @search="search"
                @keyup.enter="search"
                allow-clear
                placeholder="请输入角色名称或编码"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-button type="primary" @click="queryPage">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table resizable ref="xTable" border="inner" :loading="loading" :tree-config="{ childrenField: 'children' }" :data="tableData">
        <vxe-column field="name" title="名称" tree-node>
          <template #default="{ row }">
            <a-link @click="show(row)">{{ row.name }}</a-link>
          </template>
        </vxe-column>
        <vxe-column field="code" title="编码" />
        <vxe-column field="remark" title="说明" />
        <vxe-column fixed="right" width="270" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="addChildren(row)">添加子角色</a-link>
            <a-divider type="vertical" />
            <a-link @click="edit(row)">编辑</a-link>
            <a-divider type="vertical" />
            <a-link danger @click="remove(row)">删除</a-link>
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
      <role-edit ref="roleEdit" @ok="queryPage" />
      <role-menu-modal ref="roleMenuModal" />
      <role-path-modal ref="rolePathModal" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, ref } from 'vue'
  import { del, RoleTree, tree } from './Role.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import RoleEdit from './RoleEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from 'vue/macros'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import RoleMenuModal from './RoleMenuModal.vue'
  import RolePathModal from './RolePathModal.vue'
  import ALink from '/@/components/Link/Link.vue'
  import XEUtils from 'xe-utils'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()

  let searchName = $ref<string>()
  let tableData = $ref<RoleTree[]>([])
  let remoteTableData = $ref<RoleTree[]>([])
  let treeExpand = $ref(false)
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
    tree().then(({ data }) => {
      remoteTableData = data
      search()
      loading.value = false
    })
    return Promise.resolve()
  }
  // 新增
  function add() {
    roleEdit.init(null, FormEditType.Add)
  }
  function addChildren(record) {
    roleEdit.init(null, FormEditType.Add, record.id)
  }
  // 查看
  function edit(record) {
    roleEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    roleEdit.init(record.id, FormEditType.Show)
  }
  /**
   * 菜单授权处理
   */
  function handleRoleMenu(record) {
    roleMenuModal.init(record)
  }
  /**
   * 请求授权处理
   */
  function handleRolePath(record) {
    rolePathModal.init(record)
  }
  /**
   * 删除
   */
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否删除该数据',
      onOk: () => {
        del(record.id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }

  /**
   * 搜索
   */
  function search() {
    const search = XEUtils.toValueString(searchName).trim().toLowerCase()
    if (search) {
      const searchProps = ['name', 'code']
      tableData = XEUtils.searchTree(remoteTableData, (item) =>
        searchProps.some((key) => XEUtils.toValueString(item[key]).toLowerCase().indexOf(search) > -1),
      )
      // 搜索状态默认展开
      treeExpand = true
    } else {
      tableData = remoteTableData
    }
    nextTick(() => {
      xTable?.setAllTreeExpand(treeExpand)
    })
  }
</script>

<style lang="less" scoped></style>
