<template>
  <CollapseContainer title="安全设置" :canExpan="false">
    <a-spin :spinning="confirmLoading">
      <a-row :span="24">
        <a-col :span="14">
          <a-list>
            <a-list-item>
              <a-list-item-meta title="账户密码">
                <template #description>
                  <span>账号登录密码</span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a @click="passwordEditShow">修改</a>
              </template>
            </a-list-item>
          </a-list>
        </a-col>
      </a-row>
    </a-spin>
    <password-edit ref="passwordEdit" @ok="init" />
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import { CollapseContainer } from '/@/components/Container'
  import { $ref } from 'vue/macros'
  import { onMounted } from 'vue'
  import PasswordEdit from './PasswordEdit.vue'
  import { getUserSecurityInfo } from '/@/views/account/account.api'
  import { UserDetails } from '/@/views/account/accountModel'

  let confirmLoading = $ref(false)

  let user = $ref<UserDetails>({})
  let passwordEdit = $ref<any>()

  onMounted(() => {
    init()
  })

  function init() {
    confirmLoading = true
    getUserSecurityInfo().then(({ data }) => {
      user = data
      confirmLoading = false
    })
  }

  // 显示密码修改
  function passwordEditShow() {
    passwordEdit.init()
  }
</script>
<style lang="less" scoped>
  .extra {
    float: right;
    margin-top: 10px;
    margin-right: 30px;
    font-weight: normal;
    color: #1890ff;
    cursor: pointer;
  }
</style>
