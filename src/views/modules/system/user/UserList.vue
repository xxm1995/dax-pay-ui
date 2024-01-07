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
            <a-dropdown v-if="batchOperateFlag">
              <a-button post-icon="ant-design:down-outlined"> 批量操作 </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="assignRolesBatch()">角色分配</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="assignDeptBatch()">部门分配</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="assignDataScopeBatch()">数据角色分配</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="lockUserConfirmBatch(true)">锁定账号</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="lockUserConfirmBatch(false)">解锁账号</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="resetPwdBatch(false)">重置密码</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table
        ref="xTable"
        size="medium"
        @checkbox-all="selectAllEvent"
        @checkbox-change="selectChangeEvent"
        :loading="loading"
        :data="pagination.records"
      >
        <vxe-column type="checkbox" width="50" />
        <vxe-column field="name" title="姓名" />
        <vxe-column field="username" title="账号" />
        <vxe-column field="phone" title="手机号" />
        <vxe-column field="email" title="邮箱" />
        <vxe-column field="administrator" title="是否管理员">
          <template #default="{ row }">
            <a-tag v-if="row.administrator" color="green">是</a-tag>
            <a-tag v-else color="red">否</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="status" title="用户状态">
          <template #default="{ row }">
            {{ dictConvert('UserStatusCode', row.status) }}
          </template>
        </vxe-column>
        <vxe-column fixed="right" width="170" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a href="javascript:" @click="show(row)">查看</a>
            <a-divider type="vertical" />
            <a href="javascript:" @click="edit(row)">编辑</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /> </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-link @click="assignRoles(row)">角色分配</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="assignDept(row)">部门分配</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="assignDataScope(row)">数据角色分配</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="resetPwd(row)">重置密码</a-link>
                  </a-menu-item>
                  <a-menu-item v-if="[1, 3].includes(row.status)">
                    <a-link v-if="row.status === 1" @click="lockUserConfirm(row.id, true)">封禁账号</a-link>
                    <a-link v-if="row.status === 3" @click="lockUserConfirm(row.id, false)">解锁账号</a-link>
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
      <user-add ref="userAdd" @ok="queryPage" />
      <user-edit ref="userEdit" @ok="queryPage" />
      <user-show ref="userShow" />
      <user-reset-pwd ref="userResetPwd" />
      <user-reset-pwd-batch ref="userResetPwdBatch" />
      <user-role-assign ref="userRoleAssign" />
      <user-role-assign-batch ref="userRoleAssignBatch" />
      <user-data-scope-assign ref="userDataScopeAssign" />
      <user-data-scope-assign-batch ref="userDataScopeAssignBatch" />
      <user-dept-assign ref="userDeptAssign" />
      <user-dept-assign-batch ref="userDeptAssignBatch" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { onMounted } from 'vue'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { $ref } from 'vue/macros'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { banUser, banUserBatch, page, unlockUser, unlockUserBatch } from './User.api'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { Icon } from '/@/components/Icon'
  import UserAdd from './UserAdd.vue'
  import UserEdit from './UserEdit.vue'
  import UserShow from './UserShow.vue'
  import UserRoleAssign from './role/UserRoleAssign.vue'
  import UserRoleAssignBatch from './role/UserRoleAssignBatch.vue'
  import UserDataScopeAssign from '/@/views/modules/system/user/data/UserDataRoleAssign.vue'
  import UserDataScopeAssignBatch from '/@/views/modules/system/user/data/UserDataRoleAssignBatch.vue'
  import UserDeptAssign from './dept/UserDeptAssign.vue'
  import UserDeptAssignBatch from './dept/UserDeptAssignBatch.vue'
  import UserResetPwd from './UserResetPwd.vue'
  import UserResetPwdBatch from './UserResetPwdBatch.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading, batchOperateFlag } =
    useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  // 查询条件
  const fields = [
    { field: 'username', type: STRING, name: '账号', placeholder: '请输入要查询的账号' },
    { field: 'name', type: STRING, name: '姓名', placeholder: '请输入要查询的姓名' },
  ] as QueryField[]
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  let userAdd = $ref<any>()
  let userEdit = $ref<any>()
  let userShow = $ref<any>()
  let userRoleAssign = $ref<any>()
  let userRoleAssignBatch = $ref<any>()
  let userDataScopeAssign = $ref<any>()
  let userDataScopeAssignBatch = $ref<any>()
  let userDeptAssign = $ref<any>()
  let userDeptAssignBatch = $ref<any>()
  let userResetPwd = $ref<any>()
  let userResetPwdBatch = $ref<any>()

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
  /**
   * 选中全部
   */
  function selectAllEvent() {
    const records = xTable?.getCheckboxRecords()
    batchOperateFlag.value = !!records?.length
  }
  /**
   * 选中事件
   */
  function selectChangeEvent() {
    const records = xTable?.getCheckboxRecords()
    batchOperateFlag.value = !!records?.length
  }
  /**
   * 锁定/解锁用户
   * @param userId 用户id
   * @param type true 锁定, false 解锁
   */
  function lockUserConfirm(userId, type: boolean) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: type ? '是否封禁选中的用户' : '是否解锁选中的用户',
      onOk: async () => {
        if (type) {
          await banUser(userId)
        } else {
          await unlockUser(userId)
        }
        queryPage()
      },
    })
  }
  /**
   * 批量锁定/解锁用户
   * @param type true 锁定, false 解锁
   */
  function lockUserConfirmBatch(type) {
    const userIds = xTable?.getCheckboxRecords().map((o) => o.id)
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: type ? '是否锁定选中的用户' : '是否解锁选中的用户',
      onOk: async () => {
        if (type) {
          await banUserBatch(userIds)
        } else {
          await unlockUserBatch(userIds)
        }
        queryPage()
      },
    })
  }
  // 分配角色
  function assignRoles(record) {
    userRoleAssign.init(record)
  }
  // 批量分配角色
  function assignRolesBatch() {
    const userIds = xTable?.getCheckboxRecords().map((o) => o.id)
    userRoleAssignBatch.init(userIds)
  }
  // 分配数据权限
  function assignDataScope(record) {
    userDataScopeAssign.init(record)
  }
  // 批量分配数据权限
  function assignDataScopeBatch() {
    const userIds = xTable?.getCheckboxRecords().map((o) => o.id)
    userDataScopeAssignBatch.init(userIds)
  }
  // 分配部门
  function assignDept(record) {
    userDeptAssign.init(record.id)
  }
  // 批量分配部门
  function assignDeptBatch() {
    const userIds = xTable?.getCheckboxRecords().map((o) => o.id)
    userDeptAssignBatch.init(userIds)
  }
  function add() {
    userAdd.init()
  }
  /**
   * 查看信息
   */
  function show(record) {
    userShow.init(record.id)
  }
  /**
   * 信息编辑
   */
  function edit(record) {
    userEdit.init(record.id)
  }
  /**
   * 重置密码
   */
  function resetPwd(record) {
    userResetPwd.init(record.id)
  }
  /**
   * 重置密码
   */
  function resetPwdBatch() {
    const userIds = xTable?.getCheckboxRecords().map((o) => o.id)
    userResetPwdBatch.init(userIds)
  }
</script>

<style scoped></style>
