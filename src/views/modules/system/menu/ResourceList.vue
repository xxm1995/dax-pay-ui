<template>
  <basic-drawer
    forceRender
    v-bind="$attrs"
    title="权限资源列表"
    width="60%"
    :maskClosable="false"
    :visible="visible"
    @close="visible = false"
  >
    <vxe-toolbar ref="xToolbar" custom zoom :refresh="{ queryMethod: queryPage }">
      <template #buttons>
        <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table ref="xTable" row-id="id" :loading="loading" :data="tableData">
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="title" title="资源名称" />
      <vxe-column field="permCode" title="权限编码" />
      <vxe-column field="effect" title="是否有效">
        <template #default="{ row }">
          <a-tag v-if="row.effect" color="green">有效</a-tag>
          <a-tag v-else color="red">无效</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="remark" title="备注" />
      <vxe-column title="操作" fixed="right" width="200" :showOverflow="false">
        <template #default="{ row }">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical" />
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否删除该项" @confirm="remove(row)" okText="是" cancelText="否">
            <a href="javascript:" v-if="row.admin" disabled>删除</a>
            <a href="javascript:" v-else style="color: red">删除</a>
          </a-popconfirm>
        </template>
      </vxe-column>
    </vxe-table>
    <resource-edit ref="resourceEdit" @ok="queryPage" />
  </basic-drawer>
</template>

<script lang="ts" setup>
  import ResourceEdit from './ResourceEdit.vue'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { nextTick, onMounted } from 'vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { del, Menu, Resource, resourceList } from '/@/views/modules/system/menu/Menu.api'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'

  // 使用hooks
  const { pagination, pages, model, loading } = useTablePage(queryPage)

  let tableData = $ref<Array<Resource>>([])
  let menuInfo = $ref<Menu>()
  let visible = $ref(false)

  const xTable: VxeTableInstance = $ref()
  const xToolbar: VxeToolbarInstance = $ref()
  let resourceEdit: any = $ref()

  nextTick(() => {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  })

  function init(menu) {
    visible = true
    menuInfo = menu
    queryPage()
  }

  // 分页查询
  function queryPage() {
    loading.value = true
    resourceList(menuInfo.id).then(({ data }) => {
      tableData = data
      loading.value = false
    })
  }
  function add() {
    resourceEdit.init(null, FormEditType.Add, menuInfo.clientCode, menuInfo.id)
  }
  function edit(record: Menu) {
    resourceEdit.init(record.id, FormEditType.Edit, menuInfo.clientCode)
  }
  function show(record: Menu) {
    resourceEdit.init(record.id, FormEditType.Show, menuInfo.clientCode)
  }
  function remove(record: Menu) {
    del(record.id).then(() => queryPage())
  }

  defineExpose({
    init,
  })
</script>

<style scoped></style>
