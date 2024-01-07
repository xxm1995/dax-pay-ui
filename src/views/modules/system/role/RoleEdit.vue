<template>
  <basic-modal
    :loading="confirmLoading"
    v-bind="$attrs"
    :width="750"
    :title="title"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-form class="small-from-item" :model="form" ref="formRef" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="主键" name="id" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item v-show="addable" label="上级菜单" name="parentId">
        <a-tree-select
          style="width: 100%"
          :tree-data="treeData"
          v-model:value="form.pid"
          placeholder="请选择上级角色"
          :disabled="showable"
        />
      </a-form-item>
      <a-form-item label="编码" name="code">
        <a-input v-model:value="form.code" :disabled="showable" placeholder="请输入编码" />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="说明" name="remark">
        <a-textarea v-model:value="form.remark" :disabled="showable" placeholder="请输入说明" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { nextTick, reactive } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, update, existsByCode, existsByCodeNotId, existsByName, existsByNameNotId, Role, tree } from './Role.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
  import { useValidate } from '/@/hooks/bootx/useValidate'
  import { treeDataTranslate } from '/@/utils/dataUtil'

  const {
    initFormEditType,
    handleCancel,
    search,
    labelCol,
    wrapperCol,
    title,
    confirmLoading,
    visible,
    editable,
    addable,
    showable,
    formEditType,
  } = useFormEdit()
  const { existsByServer } = useValidate()

  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref({
    id: null,
    code: '',
    pid: undefined,
    name: '',
    remark: '',
  } as Role)

  let treeData = $ref<any[]>()

  // 校验
  const rules = reactive({
    name: [
      { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] },
      { validator: validateName, trigger: 'blur' },
    ],
    code: [
      { required: true, message: '请输入角色代码', trigger: ['blur', 'change'] },
      { validator: validateCode, trigger: 'blur' },
    ],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType, roleId) {
    initRoleTree()
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType, roleId)
  }
  /**
   * 查询树
   */
  function initRoleTree() {
    tree().then((res) => {
      treeData = treeDataTranslate(res.data, 'id', 'name')
    })
  }

  /**
   * 获取信息
   */
  function getInfo(id, editType: FormEditType, roleId) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form = data
        confirmLoading.value = false
      })
    } else if (editType === FormEditType.Add) {
      confirmLoading.value = false
      // 添加下级
      if (roleId) {
        nextTick(() => {
          form.pid = roleId
        }).then()
      }
    }
  }
  // 保存
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(form)
      } else if (formEditType.value === FormEditType.Edit) {
        await update(form)
      }
      confirmLoading.value = false
      handleCancel()
      emits('ok')
    })
  }

  // 重置表单的校验
  function resetForm() {
    nextTick(() => formRef?.resetFields())
  }
  async function validateCode() {
    const { code, id } = form
    return existsByServer(code, id, formEditType.value, existsByCode, existsByCodeNotId)
  }
  async function validateName() {
    const { name, id } = form
    return existsByServer(name, id, formEditType.value, existsByName, existsByNameNotId)
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
