<template>
  <a-drawer
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @close="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form class="small-from-item" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="主键" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="编码" v-bind="validateInfos.code" name="code">
          <a-input v-model:value="form.code" :disabled="showable" placeholder="请输入编码" />
        </a-form-item>
        <a-form-item label="名称" v-bind="validateInfos.name" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="启用状态" v-bind="validateInfos.enable" name="enable">
          <a-switch checked-children="开" un-checked-children="关" v-model:checked="form.enable" :disabled="showable || form.system" />
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
    <div class="drawer-button">
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { nextTick, reactive } from 'vue'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { Client, get } from './Client.api'
  import { useForm } from 'ant-design-vue/lib/form'
  import { FormType } from '/@/enums/formTypeEnum'

  const {
    initFormModel,
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
    type,
  } = useFormEdit()
  let form = reactive({
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
      // { validator: validateCode, trigger: 'blur' },
    ],
    name: [{ required: true, message: '请输入应用名称' }],
    enable: [{ required: true, message: '请选择启用状态' }],
  })
  // 表单
  const { resetFields, validate, validateInfos } = useForm(form, rules)

  function validateCode(rule, value, callback) {}
  // 入口
  function init(id, editType: FormType) {
    initFormModel(id, editType)
    resetForm()
    getInfo(id, editType)
  }
  // 获取信息
  function getInfo(id, type: FormType) {
    // this.initLoginTypes()
    if ([FormType.Edit, FormType.Show].includes(type)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form = reactive(data)
        confirmLoading.value = false
      })
    } else {
      confirmLoading.value = false
    }
  }
  // 保存
  async function handleOk() {
    validate().then(() => {
      confirmLoading.value = true
      console.log(form)
      confirmLoading.value = false
    })
  }

  // 重置表单的校验
  function resetForm() {
    nextTick(() => {
      resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
