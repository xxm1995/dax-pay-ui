<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    :title="title"
    :width="modalWidth"
    :mask-closable="showable"
    :visible="visible"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form class="small-from-item" ref="formRef" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="编码" name="code">
          <a-input v-model:value="form.code" :disabled="showable" @blur="validate('code')" placeholder="请输入编码" />
        </a-form-item>
        <a-form-item label="名称" name="name">
          <a-input v-model:value="form.name" :disabled="showable" @blur="validate('name')" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="启用状态" name="enable">
          <a-switch checked-children="开" un-checked-children="关" v-model:checked="form.enable" :disabled="showable || form.system" />
        </a-form-item>
        <a-form-item name="defaultEndow">
          <template #label>
            <basic-title helpMessage="新注册的用户是否默认赋予该终端">默认赋权</basic-title>
          </template>
          <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.defaultEndow" :disabled="showable" />
        </a-form-item>
        <a-form-item label="系统内置" name="system">
          <a-tag v-if="form.system" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </a-form-item>
        <a-form-item label="关联登录方式" name="loginTypeIdList">
          <a-select
            allowClear
            mode="multiple"
            v-model:value="form.loginTypeIdList"
            :default-value="form.loginTypeIdList"
            :filter-option="search"
            :disabled="showable"
            style="width: 100%"
            placeholder="选择关联的登录方式"
          >
            <a-select-option v-for="o in loginTypes" :key="o.id">
              {{ o.name }}
            </a-select-option>
          </a-select>
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
  import { nextTick, reactive, ref } from 'vue'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, Client, existsByCode, existsByCodeNotId, get, update } from './Client.api'
  import { FormInstance, Rule, useForm } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { findAll, LoginType } from '/@/views/modules/system/loginType/LoginType.api'
  import { $ref } from 'vue/macros'
  import { useValidate } from '/@/hooks/bootx/useValidate'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import BasicTitle from '/@/components/Basic/src/BasicTitle.vue'

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
  const { existsByServer } = useValidate()

  const loginTypes = ref([] as Array<LoginType>)
  const form = ref({
    id: null,
    code: '',
    name: '',
    system: false,
    enable: true,
    loginTypeIdList: [],
    description: '',
  } as Client)
  // 校验状态
  const rules = reactive({
    code: [
      { required: true, message: '请输入应用编码' },
      { validator: validateCode, trigger: 'blur' },
    ],
    name: [{ required: true, message: '请输入应用名称' }],
    enable: [{ required: true, message: '请选择启用状态' }],
  } as Record<string, Rule[]>)
  const formRef = $ref<FormInstance>()

  // 表单
  const { resetFields, validate, validateInfos } = useForm(form, rules)
  // 事件
  const emits = defineEmits(['ok'])

  // 入口
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    initLoginTypes()
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
  // 初始化登录方式列表
  async function initLoginTypes() {
    const { data } = await findAll()
    loginTypes.value = data
  }
  // 保存
  function handleOk() {
    validate().then(async () => {
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
      resetFields()
    })
  }

  // 校验编码重复
  async function validateCode() {
    const { code, id } = form.value
    return existsByServer(code, id, formEditType, existsByCode, existsByCodeNotId)
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped>
  .vben-basic-title {
    font-size: 14px;
  }
</style>
