<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :query-params="model.queryParam"
        :fields="fields"
        @query="queryPage"
        @reset="resetQueryParams"
      />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add"
              >新建</a-button
            >
            <a-dropdown v-if="batchOperateFlag">
              <a-button post-icon="ant-design:down-outlined"> 批量操作 </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="assignRolesBatch()">角色分配</a>
                  </a-menu-item>
                  <!--                  <a-menu-item>-->
                  <!--                    <a @click="lockUserConfirmBatch(true)">锁定账号</a>-->
                  <!--                  </a-menu-item>-->
                  <!--                  <a-menu-item>-->
                  <!--                    <a @click="lockUserConfirmBatch(false)">解锁账号</a>-->
                  <!--                  </a-menu-item>-->
                  <a-menu-item>
                    <a @click="resetPwdBatch()">重置密码</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </vxe-toolbar>
      <div class="h-65vh">
        <vxe-table
          ref="xTable"
          height="auto"
          size="medium"
          @checkbox-all="selectAllEvent"
          @checkbox-change="selectChangeEvent"
          :loading="loading"
          :data="pagination.records"
        >
          <vxe-column type="checkbox" width="50" />
          <vxe-column field="name" title="姓名" />
          <vxe-column field="account" title="账号" />
          <vxe-column field="phone" title="手机号" />
          <vxe-column field="email" title="邮箱" />
          <vxe-column field="avatar" title="头像" align="center">
            <template #default="{ row }">
              <Avatar size="large" :src="getFileUrl(row.avatar)" />
            </template>
          </vxe-column>

          <vxe-column field="status" title="用户状态" align="center">
            <template #default="{ row }">
              {{ dictConvert('UserStatusCode', row.status) || '无' }}
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
                      <a-link @click="resetPwd(row)">重置密码</a-link>
                    </a-menu-item>
                    <a-menu-item v-if="[1, 3].includes(row.status)">
                      <a-link v-if="row.status === 1" @click="lockUserConfirm(row.id, true)"
                        >封禁账号</a-link
                      >
                      <a-link v-if="row.status === 3" @click="lockUserConfirm(row.id, false)"
                        >解锁账号</a-link
                      >
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <vxe-pager
        size="medium"
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
      <UserAdd ref="userAdd" @ok="queryPage" />
      <UserEdit ref="userEdit" @ok="queryPage" />
      <UserShow ref="userShow" />
      <UserResetPwd ref="userResetPwd" />
      <UserRoleAssign ref="userRoleAssign" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { Avatar } from 'ant-design-vue'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import { useMessage } from '@/hooks/web/useMessage'
  import { onMounted, ref } from 'vue'
  import { QueryField, STRING } from '@/components/Bootx/Query/Query'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useDict } from '@/hooks/bootx/useDict'
  import { Icon } from '@/components/Icon'
  import UserShow from './UserShow.vue'
  import UserEdit from './UserEdit.vue'
  import UserAdd from './UserAdd.vue'
  import UserResetPwd from './UserResetPwd.vue'
  import UserRoleAssign from './UserRoleAssign.vue'
  import ALink from '@/components/Link/Link.vue'
  import { useFilePlatform } from '@/hooks/bootx/useFilePlatform'
  import { page } from './MerchantUser.api'

  // 使用hooks
  const {
    handleTableChange,
    pageQueryResHandel,
    resetQueryParams,
    pagination,
    pages,
    model,
    loading,
    batchOperateFlag,
  } = useTablePage(queryPage)
  const { dictConvert } = useDict()
  const { getFileUrl } = useFilePlatform()

  // 查询条件
  const fields = [
    { field: 'account', type: STRING, name: '账号', placeholder: '请输入要查询的账号' },
    { field: 'name', type: STRING, name: '姓名', placeholder: '请输入要查询的姓名' },
  ] as QueryField[]
  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  let userAdd = ref<any>()
  let userEdit = ref<any>()
  let userShow = ref<any>()
  let userRoleAssign = ref<any>()
  let userResetPwd = ref<any>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
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
    const records = xTable.value?.getCheckboxRecords()
    batchOperateFlag.value = !!records?.length
  }
  /**
   * 选中事件
   */
  function selectChangeEvent() {
    const records = xTable.value?.getCheckboxRecords()
    batchOperateFlag.value = !!records?.length
  }
  // 分配角色
  function assignRoles(record) {
    userRoleAssign.value.init(false, record.id)
  }
  // 批量分配角色
  function assignRolesBatch() {
    const userIds = xTable.value?.getCheckboxRecords().map((o) => o.id)
    userRoleAssign.value.init(true, userIds)
  }
  function add() {
    userAdd.value.init()
  }
  /**
   * 查看信息
   */
  function show(record) {
    userShow.value.init(record.id)
  }
  /**
   * 信息编辑
   */
  function edit(record) {
    userEdit.value.init(record.id)
  }
  /**
   * 重置密码
   */
  function resetPwd(record) {
    userResetPwd.value.init(false, record.id)
  }
  /**
   * 重置密码
   */
  function resetPwdBatch() {
    const userIds = xTable.value?.getCheckboxRecords().map((o) => o.id)
    userResetPwd.value.init(true, userIds)
  }
</script>

<style scoped></style>
