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
            <a-list-item>
              <a-list-item-meta title="绑定手机号">
                <template #description>
                  <template v-if="user.phone">
                    <span>已绑定手机</span>
                    <span> : </span>
                    <span>{{ user.phone }}</span>
                  </template>
                  <template v-else>
                    <span>未绑定手机</span>
                  </template>
                </template>
              </a-list-item-meta>
              <template #actions>
                <template v-if="user.phone">
                  <a @click="phoneEditShow">修改</a>
                </template>
                <template v-else>
                  <a @click="phoneBindShow" style="color: red">绑定</a>
                </template>
              </template>
            </a-list-item>
            <a-list-item>
              <a-list-item-meta title="账号邮箱">
                <template #description>
                  <template v-if="user.email">
                    <span>已绑定邮箱</span>
                    <span> : </span>
                    <span>{{ user.email }}</span>
                  </template>
                  <template v-else>
                    <span>未绑定邮箱</span>
                  </template>
                </template>
              </a-list-item-meta>
              <template #actions>
                <template v-if="user.email">
                  <a @click="emailEditShow">修改</a>
                </template>
                <template v-else>
                  <a @click="emailBindShow" style="color: red">绑定</a>
                </template>
              </template>
            </a-list-item>
          </a-list>
        </a-col>
      </a-row>
    </a-spin>
    <password-edit ref="passwordEdit" @ok="init" />
    <phone-edit ref="phoneEdit" @ok="init" :phone="user.phone" />
    <phone-bind ref="phoneBind" @ok="init" />
    <email-edit ref="emailEdit" @ok="init" :email="user.email" />
    <email-bind ref="emailBind" @ok="init" />
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import { CollapseContainer } from '/@/components/Container'
  import { $ref } from 'vue/macros'
  import { onMounted } from 'vue'
  import PasswordEdit from './PasswordEdit.vue'
  import PhoneBind from './PhoneBind.vue'
  import EmailEdit from './EmailEdit.vue'
  import EmailBind from './EmailBind.vue'
  import PhoneEdit from './PhoneEdit.vue'
  import { getUserSecurityInfo } from '/@/views/account/account.api'
  import { UserDetails } from '/@/views/account/accountModel'

  let confirmLoading = $ref(false)

  let user = $ref<UserDetails>({})
  let passwordEdit = $ref<any>()
  let phoneEdit = $ref<any>()
  let phoneBind = $ref<any>()
  let emailEdit = $ref<any>()
  let emailBind = $ref<any>()

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
  // 修改绑定邮箱
  function emailEditShow() {
    emailEdit.init()
  }
  // 修改绑定手机号
  function phoneEditShow() {
    phoneEdit.init()
  }
  // 绑定手机号
  function phoneBindShow() {
    phoneBind.init()
  }
  // 绑定邮箱
  function emailBindShow() {
    emailBind.init()
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
