<template>
  <a-drawer :title="title" width="50%" :mask-closable="showable" @close="handleCancel" :visible="visible" :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <a-form ref="formRef" class="small-from-item" :model="form" :rules="rules" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-form-item name="id" hidden="true">
          <a-input v-model="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="菜单名称" name="title">
          <a-input v-model:value="form.title" :disabled="showable" placeholder="请输入title" />
        </a-form-item>
        <a-form-item label="路由名称" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入路由名称" />
        </a-form-item>
        <a-form-item label="访问路径" name="path">
          <a-input v-model:value="form.path" :disabled="showable" placeholder="请输入访问路径" />
        </a-form-item>
        <a-form-item label="组件名称" name="component">
          <a-input v-model:value="form.component" :disabled="showable" placeholder="请输入组件名称" />
        </a-form-item>
        <a-form-item label="菜单跳转地址(重定向)" name="redirect">
          <a-input v-model:value="form.redirect" :disabled="showable" placeholder="请输入重定向" />
        </a-form-item>
        <a-form-item label="排序" name="sortNo">
          <a-input-number placeholder="请输入菜单排序，可以是小数" :disabled="showable" v-model:value="form.sortNo" style="width: 200px" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-drawer>
</template>

<script lang="ts" setup>
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { nextTick, reactive, ref } from 'vue'
  import { Rule } from 'ant-design-vue/lib/form'
  import { $ref } from 'vue/macros'
  import { add, get, Menu, update } from '/@/views/modules/system/menu/Menu.api'
  import { FormEditType } from '/@/enums/formTypeEnum'

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
    formEditType,
  } = useFormEdit()

  const formRef = ref()

  let form = $ref({
    parentId: null,
    title: '',
    name: '',
    path: '',
    component: '',
    redirect: '',
    sortNo: 0,
    icon: '',
    hidden: false,
    hideChildrenInMenu: false,
    keepAlive: true,
    hiddenHeaderContent: false,
    targetOutside: false,
    menuType: 0,
  } as Menu)

  const rules = reactive({
    title: [{ required: true, message: '请输入菜单或权限名称' }],
    name: [{ required: true, message: '请输入路由名称' }],
    path: [{ required: true, message: '请输入菜单路径' }],
    url: [{ required: true, message: '请输入菜单路径' }],
  } as Record<string, Rule[]>)

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    console.log(id)
    initFormModel(id, editType)
    resetForm()
    getInfo(id, editType)
  }
  // 获取信息
  function getInfo(id, editType: FormEditType) {
    // this.initLoginTypes()
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form = data
        confirmLoading.value = false
      })
    } else {
      confirmLoading.value = false
    }
  }
  // 保存
  function handleOk() {
    formRef.value!.validate().then(async () => {
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
    nextTick(() => {
      formRef.value!.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style scoped></style>
