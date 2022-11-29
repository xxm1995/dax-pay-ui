<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    :width="modalWidth"
    :title="title"
    :mask-closable="showable"
    :visible="visible"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form class="small-from-item" ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="编码" name="code">
          <a-input v-model:value="form.code" :disabled="showable" placeholder="请输入登录方式编码" />
        </a-form-item>
        <a-form-item label="名称" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入登录方式名称" />
        </a-form-item>
        <a-form-item label="类型" name="type">
          <a-radio-group v-model:value="form.type" button-style="solid">
            <a-radio-button :value="PASSWORD"> 账号密码 </a-radio-button>
            <a-radio-button :value="OPEN_ID"> 第三方登录 </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="系统内置" name="system">
          <a-tag v-if="form.system" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </a-form-item>
        <a-form-item label="启用状态" name="enable">
          <a-switch checked-children="开" un-checked-children="关" v-model:checked="form.enable" :disabled="showable || form.system" />
        </a-form-item>
        <a-form-item label="启用验证码" name="captcha">
          <a-switch checked-children="开" un-checked-children="关" v-model:checked="form.captcha" :disabled="showable" />
        </a-form-item>
        <a-form-item label="超时时间(分钟)" name="timeout">
          <a-input-number
            v-model:value="form.timeout"
            :disabled="showable"
            :precision="0"
            :min="5"
            :step="5"
            placeholder="请输入超时时间(分钟)"
          />
        </a-form-item>
        <a-form-item label="密码可错误次数" name="pwdErrNum" v-show="form.type === PASSWORD">
          <a-input-number
            v-model:value="form.pwdErrNum"
            :disabled="showable"
            :min="-1"
            :step="1"
            :precision="0"
            placeholder="请输入密码可错误次数"
          />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="form.description" :disabled="showable" placeholder="请输入描述" />
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { nextTick, reactive, ref } from 'vue'
  import { add, LoginType, get, existsByCode, existsByCodeNotId, update, PASSWORD, OPEN_ID } from './LoginType.api'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { $ref } from 'vue/macros'
  import { useValidate } from '/@/hooks/bootx/useValidate'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  const { existsByServer } = useValidate()

  const {
    initFormEditType,
    handleCancel,
    search,
    labelCol,
    wrapperCol,
    title,
    modalWidth,
    confirmLoading,
    visible,
    editable,
    showable,
    formEditType,
  } = useFormEdit()
  const form = ref({
    id: null,
    code: '',
    name: '',
    type: PASSWORD,
    system: false,
    enable: true,
    description: '',
  } as LoginType)
  const formRef: FormInstance = $ref()
  // 校验状态
  const rules = reactive({
    code: [
      { required: true, message: '请输入登录方式编码', trigger: ['blur', 'change'] },
      { required: true, validator: validateCode, trigger: 'blur' },
    ],
    name: [{ required: true, message: '请输入登录方式名称', trigger: ['blur', 'change'] }],
    enable: [{ required: true, message: '请选择启用状态' }],
  } as Record<string, Rule[]>)
  // 校验编码重复
  async function validateCode() {
    const { code, id } = form.value
    return existsByServer(code, id, formEditType, existsByCode, existsByCodeNotId)
  }

  // 事件
  const emits = defineEmits(['ok'])

  // 入口
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }
  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form.value = data
        confirmLoading.value = false
      })
    } else {
      confirmLoading.value = false
    }
  }
  // 保存
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(form.value)
      } else if (formEditType.value === FormEditType.Edit) {
        await update(form.value)
      }
      confirmLoading.value = false
      handleCancel()
      emits('ok')
    })
  }

  // 重置表单的校验
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
