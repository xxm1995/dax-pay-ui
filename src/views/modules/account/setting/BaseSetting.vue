<template>
  <CollapseContainer title="基本设置" :canExpan="false">
    <a-row :gutter="24">
      <a-col :span="14">
        <a-form
          class="small-from-item"
          ref="formRef"
          :validate-trigger="['blur', 'change']"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item label="名称" name="name">
            <a-input v-model:value="form.name" :disabled="!edit" placeholder="请输入名称" />
          </a-form-item>
        </a-form>
        <!--        <BasicForm @register="register" />-->
      </a-col>
      <a-col :span="10">
        <div class="change-avatar">
          <div class="mb-2">头像</div>
          <CropperAvatar
            :uploadApi="uploadApi"
            :value="avatar"
            btnText="更换头像"
            :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
            @change="updateAvatar"
            width="150"
          />
        </div>
      </a-col>
    </a-row>
    <a-button type="primary" @click="handleSubmit"> 更新基本信息 </a-button>
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import { Button, Row, Col } from 'ant-design-vue'
  import { computed, defineComponent, onMounted, reactive } from 'vue'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { CollapseContainer } from '/@/components/Container'
  import { CropperAvatar } from '/@/components/Cropper'

  import { useMessage } from '/@/hooks/web/useMessage'

  import headerImg from '/@/assets/images/header.jpg'
  import { accountInfoApi } from '/@/api/demo/account'
  import { baseSetschemas } from './data'
  import { useUserStore } from '/@/store/modules/user'
  import { uploadApi } from '/@/api/sys/upload'
  import { $ref } from 'vue/macros'
  import { UserInfo } from '/#/store'
  import { Rule } from 'ant-design-vue/lib/form'

  const { createMessage } = useMessage()
  const userStore = useUserStore()

  // 表单项标题文字
  const labelCol = { sm: { span: 3 } }
  // 表单项内容
  const wrapperCol = { sm: { span: 12 } }

  let edit = $ref(false)
  // 用户信息
  let form = $ref({} as UserInfo)
  const rules = reactive({
    code: [{ required: true, message: '请输入表单编码' }],
    name: [{ required: true, message: '请输入表单名称' }],
  } as Record<string, Rule[]>)

  // onMounted(async () => {
  //   const data = await accountInfoApi()
  //   setFieldsValue(data)
  // })

  // 头像
  const avatar = computed(() => {
    const { avatar } = userStore.getUserInfo
    return avatar || headerImg
  })

  // 更新头像
  function updateAvatar(src: string) {
    const userinfo = userStore.getUserInfo
    userinfo.avatar = src
    userStore.setUserInfo(userinfo)
  }
  function handleSubmit() {}
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }
</style>
