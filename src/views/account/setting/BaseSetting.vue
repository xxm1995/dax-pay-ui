<template>
  <CollapseContainer title="基本设置" :canExpan="false">
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="24">
        <a-col :span="14">
          <a-form
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
            <a-form-item label="性别" name="sex">
              <a-select style="width: 200px" v-model:value="form.sex" :options="sexList" :disabled="!edit" placeholder="请选择性别" />
            </a-form-item>
            <a-form-item label="生日" name="birthday">
              <a-date-picker placeholder="请选择日期" valueFormat="YYYY-MM-DD" :disabled="!edit" v-model:value="form.birthday" />
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :span="10">
          <div class="change-avatar">
            <div class="mb-2">头像</div>
            <CropperAvatar
              v-if="edit"
              :uploadApi="uploadFile"
              :value="avatar"
              btnText="上传头像"
              :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
              @change="updateAvatar"
              width="150"
            />
            <img :src="avatar" style="width: 150px" v-else alt="avatar" />
          </div>
        </a-col>
      </a-row>
      <a-button v-if="edit" type="primary" @click="handleOk">更新基础信息</a-button>
      <a-button v-else @click="edit = true">编辑基础信息</a-button>
    </a-spin>
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import headerImg from '/@/assets/images/header.jpg'
  import { onMounted, reactive } from 'vue'
  import { CollapseContainer } from '/@/components/Container'
  import { CropperAvatar } from '/@/components/Cropper'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useUserStore } from '/@/store/modules/user'
  import { $ref } from 'vue/macros'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { getFilePreviewUrlPrefix, UpdateFileInfo, uploadFile } from '/@/api/common/FileUpload'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { UserBaseInfo } from '/@/views/account/accountModel'
  import { getUserBaseInfo, updateBaseInfo } from '/@/views/account/account.api'

  const { createMessage, createConfirm } = useMessage()
  const userStore = useUserStore()
  const { dictDropDownNumber } = useDict()
  let sexList = $ref<LabeledValue[]>()
  // 表单项标题文字
  const labelCol = { sm: { span: 3 } }
  // 表单项内容
  const wrapperCol = { sm: { span: 12 } }
  let formRef = $ref<FormInstance>()

  let confirmLoading = $ref(false)
  let edit = $ref(false)
  let avatar = $ref(headerImg)
  let urlPrefix = $ref('')

  // 用户信息
  let form = $ref<UserBaseInfo>({
    avatar: '',
    birthday: '',
    id: 0,
    name: '',
    sex: 0,
  })
  const rules = reactive({
    code: [{ required: true, message: '请输入表单编码' }],
    name: [{ required: true, message: '请输入表单名称' }],
  } as Record<string, Rule[]>)

  onMounted(async () => {
    // 初始化用户信息
    await init()
  })

  // 基础数据
  async function init() {
    confirmLoading = true
    // 初始化角色下拉菜单
    sexList = dictDropDownNumber('Sex')

    const { data: userInfo } = await getUserBaseInfo()
    // 设置头像
    const result = await getFilePreviewUrlPrefix()
    urlPrefix = result.data
    avatar = userInfo.avatar ? urlPrefix + userInfo.avatar : headerImg
    form = userInfo
    confirmLoading = false
  }
  // 上传头像回调
  function updateAvatar(file: UpdateFileInfo) {
    form.avatar = file.id
  }
  // 更新用户信息
  async function handleOk() {
    await formRef?.validate()
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否更新用户基础信息',
      onOk: async () => {
        confirmLoading = true
        await updateBaseInfo(form)
        createMessage.success('更新用户信息成功')
        await userStore.refreshUserInfoAction()
        confirmLoading = false
      },
    })
  }
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
