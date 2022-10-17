<template>
  <a-drawer :title="title" width="50%" :mask-closable="showable" @close="handleCancel" :visible="visible" :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <a-form ref="formRef" class="small-from-item" :model="form" :rules="rules" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-form-item name="id" :hidden="true">
          <a-input v-model="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="菜单类型">
          <a-radio-group :disabled="showable" v-model:value="form.menuType">
            <a-radio :value="0">一级菜单</a-radio>
            <a-radio :value="1">子菜单</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-show="form.menuType !== 0" label="上级菜单" name="parentId">
          <a-tree-select
            style="width: 100%"
            :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
            :tree-data="treeData"
            v-model:value="form.parentId"
            placeholder="请选择父级菜单"
            :disabled="showable"
          />
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
        <a-form-item label="隐藏菜单" name="hidden">
          <a-switch :disabled="showable" checkedChildren="是" unCheckedChildren="否" v-model:checked="form.hidden" />
        </a-form-item>
        <a-form-item label="隐藏子菜单" name="hideChildrenInMenu">
          <a-switch :disabled="showable" checkedChildren="是" unCheckedChildren="否" v-model:checked="form.hideChildrenInMenu" />
        </a-form-item>
        <a-form-item label="是否缓存路由" name="keepAlive">
          <a-switch :disabled="showable" checkedChildren="是" unCheckedChildren="否" v-model:checked="form.keepAlive" />
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
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { computed, nextTick, onMounted, reactive, ref } from 'vue'
  import { $ref } from 'vue/macros'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { add, get, Menu, menuTree, update } from '/@/views/modules/system/menu/Menu.api'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { treeDataTranslate } from '/@/utils/dataUtil'

  const { initFormModel, handleCancel, search, labelCol, wrapperCol, title, confirmLoading, visible, editable, showable, formEditType } =
    useFormEdit()

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

  const rules = computed(() => {
    return {
      parentId: [{ required: form.menuType === 1, message: '请选择父级菜单' }],
      title: [{ required: true, message: '请输入菜单或权限名称' }],
      name: [{ required: true, message: '请输入路由名称' }],
      path: [{ required: true, message: '请输入菜单路径' }],
      url: [{ required: true, message: '请输入菜单路径' }],
    } as Record<string, Rule[]>
  })
  let treeData: unknown[] = $ref()
  const formRef: FormInstance = $ref()

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType, clientCode, row) {
    initMenuTree(clientCode)
    initFormModel(id, editType)
    resetForm()
    getInfo(id, editType, row)
  }
  // 查询树
  function initMenuTree(clientCode) {
    menuTree(clientCode).then((res) => {
      treeData = treeDataTranslate(res.data, 'id', 'title')
    })
  }

  // 获取信息
  async function getInfo(id, editType: FormEditType, row) {
    // 编辑或查看
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form = data
        confirmLoading.value = false
      })
      // 新增
    } else if (editType === FormEditType.Add) {
      confirmLoading.value = false
    } else {
      // 添加下级
      if (row) {
        // 添加下级
        form.menuType = 1
        nextTick(() => {
          form.parentId = row.id
          form.path = row.path
        }).then()
        // 复制
      } else {
        // 复制
        const { data } = await get(id)
        delete data.id
        form = data
        confirmLoading.value = false
      }
    }
  }
  // 保存
  function handleOk() {
    formRef.validate().then(async () => {
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
      formRef.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style scoped></style>
