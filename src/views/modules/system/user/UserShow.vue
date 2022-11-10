<template>
  <basic-drawer
    show-footer
    title="添加用户"
    v-bind="$attrs"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="false"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form shio class="small-from-item" ref="formRef" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="用户账号" name="username">
          <a-input disabled v-model:value="form.username" />
        </a-form-item>
        <a-form-item label="用户名称" name="name">
          <a-input disabled v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="手机号" name="phone">
          <a-input disabled v-model:value="form.phone" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input disabled v-model:value="form.email" />
        </a-form-item>
        <a-form-item label="管理员">
          <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.admin" disabled />
        </a-form-item>
        <a-form-item label="用户状态">
          <a-tag>{{ dictConvert('UserStatusCode', form.status) }}</a-tag>
        </a-form-item>
        <a-form-item label="角色列表">
          <a-tag color="green" v-for="o in roles" :key="o.id">{{ o.name }}</a-tag>
        </a-form-item>
        <a-form-item label="终端列表">
          <a-tag color="green" v-for="o in clientList" :key="o.id">{{ o.name }}</a-tag>
        </a-form-item>
        <a-form-item label="数据权限">
          <a-tag color="green" v-show="dataScope.name">{{ dataScope.name }}</a-tag>
        </a-form-item>
        <a-form-item label="部门列表">
          <a-tag color="green" v-for="o in deptList" :key="o.id">{{ o.deptName }}</a-tag>
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { $ref } from 'vue/macros'
  import { Client, findAll } from '/@/views/modules/system/client/Client.api'
  import { Role } from '/@/views/modules/system/role/Role.api'
  import { get, UserInfo } from '/@/views/modules/system/user/User.api'
  import { getDataScopeByUser, getDeptList, getRoles } from '/@/views/modules/system/user/UserAssign.api'
  import { DataScope } from '/@/views/modules/system/scope/DataScope.api'
  import { Dept } from '/@/views/modules/system/dept/Dept.api'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { onMounted } from 'vue'

  const { handleCancel, labelCol, wrapperCol, modalWidth, title, confirmLoading, visible } = useFormEdit()
  const { dictConvert } = useDict()

  let form = $ref<UserInfo>({
    name: '',
    username: '',
  })
  let roles = $ref<Role[]>([])
  let clients = $ref<Client[]>([])
  let clientList = $ref<Client[]>([])
  let dataScope = $ref<DataScope>({})
  let deptList = $ref<Dept[]>([])

  async function init(id) {
    confirmLoading.value = true
    visible.value = true
    await get(id).then((res) => {
      form = res.data
    })
    clientList = getClientList() as Client[]
    await getRoles(id).then((res) => {
      roles = res.data
    })
    await getDeptList(id).then((res) => {
      deptList = res.data
    })
    await getDataScopeByUser(id).then((res) => {
      dataScope = res.data
    })
    confirmLoading.value = false
  }

  // 获取用户关联终端信息
  function getClientList() {
    const clientIds = form.clientIdList as string[]
    return clientIds.map((clientId) => {
      return getClientById(clientId)
    })
  }
  // 根据应用id获取应用对象
  function getClientById(clientId) {
    const item = clients.filter((client) => {
      return clientId === client.id
    })
    if (item && item.length > 0) {
      return item[0]
    } else {
      return {}
    }
  }

  // 初始化终端列表
  async function initClients() {
    const { data } = await findAll()
    clients = data
  }
  onMounted(() => {
    initClients()
  })
  defineExpose({ init })
</script>

<style scoped></style>
