<template>
  <basic-modal v-bind="$attrs" :loading="confirmLoading" width="50%" title="查看" :visible="visible" @cancel="visible = false">
    <description :column="2" :data="data" :schema="schema" />
    <template #footer>
      <a-button key="cancel" @click="visible = false">取消</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { Description } from '/@/components/Description'
  import { Client } from '/@/views/modules/system/client/Client.api'
  import { $ref } from 'vue/macros'
  import { get, LoginLog } from './LoginLog.api'
  import { DescItem } from '/@/components/Description'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { LoginType } from '/@/views/modules/system/loginType/LoginType.api'
  import { findOneByField } from '/@/utils/dataUtil'

  const props = defineProps<{
    clients: Client[]
    loginTypes: LoginType[]
  }>()

  let data = $ref<LoginLog>()
  let visible = $ref(false)
  let confirmLoading = $ref(false)
  let schema = [
    { field: 'id', label: '主键' },
    { field: 'account', label: '登录账号' },
    { field: 'login', label: '登录成功状态', render: (curVal) => (curVal ? '成功' : '失败') },
    { field: 'client', label: '登录终端', render: (curVal) => getClient(curVal) },
    { field: 'loginType', label: '登录方式', render: (curVal) => getLoginType(curVal) },
    { field: 'ip', label: '登录IP地址' },
    { field: 'browser', label: '浏览器类型' },
    { field: 'os', label: '操作系统' },
    { field: 'msg', label: '提示消息' },
    { field: 'loginTime', label: '访问时间' },
  ] as DescItem[]

  function show(id) {
    visible = true
    confirmLoading = true
    get(id).then((res) => {
      data = res.data
      confirmLoading = false
    })
  }
  // 获取终端信息
  function getClient(code) {
    return findOneByField(props.clients, code, 'code')?.['name']
  }
  // 获取登录方式信息
  function getLoginType(code) {
    return findOneByField(props.loginTypes, code, 'code')?.['name']
  }
  defineExpose({
    show,
  })
</script>

<style scoped></style>
