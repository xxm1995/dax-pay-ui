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
      <a-form class="small-from-item" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="编码" has-feedback name="code">
          <a-input v-model:value="form.code" :disabled="showable" placeholder="请输入编码" />
        </a-form-item>
        <a-form-item label="名称" has-feedback name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="启用状态" name="enable">
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
            placeholder="选择关联的终端"
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
  import { reactive, toRef, toRefs } from 'vue'
  const model = reactive({
    // 表单项标题文字
    labelCol: {
      sm: { span: 7 },
    },
    // 表单项内容
    wrapperCol: {
      sm: { span: 13 },
    },
    title: '新增',
    rawForm: {},
    modalWidth: '50%',
    confirmLoading: false,
    visible: false,
    editable: false,
    addable: false,
    showable: false,
    type: 'add',
  })
  const { labelCol, wrapperCol, title, modalWidth, confirmLoading, visible, editable, addable, showable, type } = toRefs(model)
  const form = reactive({
    id: null,
    code: null,
    name: null,
    system: false,
    enable: true,
    loginTypeIdList: [],
    description: '',
  })
  const rules = reactive({
    code: [
      { required: true, message: '请输入应用编码', trigger: ['change', 'blur'] },
      // { validator: validateCode, trigger: 'blur' },
    ],
    name: [{ required: true, message: '请输入应用名称', trigger: ['change', 'blur'] }],
    enable: [{ required: true, message: '请选择启用状态', trigger: ['change', 'blur'] }],
  })

  function handleCancel() {
    visible.value = false
    addable.value = false
    editable.value = false
    showable.value = false
  }
  function validateCode(rule, value, callback) {}

  function init(record, editType: string, ...vars) {
    type.value = editType
    visible.value = true
    if (editType && editType === 'add') {
      addable.value = true
      title.value = '新增'
    }
    if (editType === 'edit') {
      editable.value = true
      title.value = '修改'
    }
    if (editType === 'show') {
      showable.value = true
      title.value = '查看'
    }
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
