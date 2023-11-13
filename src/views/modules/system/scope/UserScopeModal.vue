<template>
  <basic-drawer forceRender v-bind="$attrs" title="用户范围权限分配" width="60%" :visible="visible" @close="visible = false">
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryList }">
      <template #buttons>
        <a-space>
          <a-button type="primary" pre-icon="ant-design:usergroup-add" @click="selectUserShow">选择用户</a-button>
          <a-popconfirm title="是否删除这些关联的用户" @confirm="deleteUser()" okText="是" cancelText="否">
            <a-button v-show="selectIds.length > 0" type="danger" pre-icon="ant-design:usergroup-delete">删除</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table
      ref="xTable"
      row-id="id"
      :loading="loading"
      :data="tableData"
      @checkbox-change="checkboxChange"
      @checkbox-all="checkboxChange"
    >
      <vxe-column type="checkbox" width="50" />
      <vxe-column field="name" title="用户名称" />
      <vxe-column field="username" title="用户账号" />
    </vxe-table>
    <b-user-select-modal ref="userSelectModal" @ok="selectUser" title="选择指定用户" :multiple="true" />
  </basic-drawer>
</template>

<script lang="ts" setup>
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { $ref } from 'vue/macros'
  import { DataScopeUser, deleteBatchUserAssign, findUsersByDataScopeId, saveUserAssign } from '/@/views/modules/system/scope/DataScope.api'
  import BUserSelectModal from '/@/components/Bootx/UserSelectModal/BUserSelectModal.vue'
  import { VxeTableInstance } from 'vxe-table'

  let loading = $ref(false)
  let visible = $ref(false)
  let selectIds = $ref<string[]>([])
  let dataScopeId = $ref<string>()

  let tableData = $ref<DataScopeUser[]>([])
  const userSelectModal = $ref<any>()
  const xTable = $ref<VxeTableInstance>()

  function init(id) {
    dataScopeId = id
    visible = true
    queryList()
  }
  // 查询关联用户信息
  function queryList() {
    loading = true
    findUsersByDataScopeId(dataScopeId).then(({ data }) => {
      tableData = data
      loading = false
    })
  }
  // 多选变动事件
  function checkboxChange() {
    selectIds = xTable?.getCheckboxRecords().map((res) => res.id) as string[]
  }
  // 选中用户, 进行保存
  function selectUser(userIds) {
    loading = true
    saveUserAssign({
      dataScopeId,
      userIds,
    }).then(() => {
      queryList()
    })
  }
  // 打开选择用户窗口
  function selectUserShow() {
    const userIds = tableData.map((res) => res.userId)
    userSelectModal.init(userIds)
  }
  // 删除用户关联消息
  function deleteUser() {
    loading = true
    deleteBatchUserAssign(selectIds).then((_) => {
      queryList()
    })
  }
  defineExpose({ init })
</script>

<style scoped></style>
