<template>
  <basic-drawer showFooter v-bind="$attrs" width="50%" :title="title" :mask-closable="showable" :visible="visible" @close="handleCancel">
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
          <a-input v-model:value="form.title" :disabled="showable" placeholder="请输入菜单名称" />
        </a-form-item>
        <a-form-item name="name">
          <template #label>
            <basic-title
              helpMessage="此处名称应和vue组件的name属性保持一致。
              路由名称不能重复，主要用于路由缓存功能。
              如果路由名称和vue组件的name属性不一致，则会导致路由缓存失效。不填则随机自动生成"
              >路由名称</basic-title
            >
          </template>
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入路由名称" />
        </a-form-item>
        <a-form-item name="path">
          <template #label>
            <basic-title
              helpMessage="输入网址或以outside://开头会的路径从外部打开页面，请求路径后添加?onlytab=1&__full__参数后，只显示显示标签页内容"
              >访问路径</basic-title
            >
          </template>
          <a-input v-model:value="form.path" :disabled="showable" placeholder="请输入访问路径" />
        </a-form-item>
        <a-form-item name="component">
          <template #label>
            <basic-title help-message="Layout 和 Iframe可以直接输入，新页面打开访问地址为空不填写，自定义组件需要输入/src/views/下的全路径">
              组件
            </basic-title>
          </template>
          <a-input v-model:value="form.component" :disabled="showable" placeholder="请输入组件名称" />
        </a-form-item>
        <a-form-item name="redirect">
          <template #label>
            <basic-title help-message="组件是Iframe的情况下，此配置为内嵌页面中请求地址"> 默认跳转地址 </basic-title>
          </template>
          <a-input v-model:value="form.redirect" :disabled="showable" placeholder="请输入跳转地址(重定向)" />
        </a-form-item>
        <a-form-item label="菜单图标" name="icon">
          <icon-picker v-model:value="form.icon" :disabled="showable" />
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
  import { computed, nextTick } from 'vue'
  import { $ref } from 'vue/macros'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { add, get, Menu, menuTree, update } from '/@/views/modules/system/menu/Menu.api'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { treeDataTranslate } from '/@/utils/dataUtil'
  import IconPicker from '/@/components/Icon/src/IconPicker.vue'
  import BasicTitle from '/@/components/Basic/src/BasicTitle.vue'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'

  const { initFormEditType, handleCancel, search, labelCol, wrapperCol, title, confirmLoading, visible, editable, showable, formEditType } =
    useFormEdit()

  let form = $ref({
    parentId: null,
    title: '',
    clientCode: '',
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
      parentId: [{ required: form.menuType === 1, message: '请选择父级菜单', trigger: ['blur', 'change'] }],
      title: [{ required: true, message: '请输入菜单名称', trigger: ['blur', 'change'] }],
      // name: [{ required: true, message: '请输入路由名称', trigger: ['blur', 'change'] }],
      path: [{ required: true, message: '请输入菜单路径', trigger: ['blur', 'change'] }],
      url: [{ required: true, message: '请输入菜单路径', trigger: ['blur', 'change'] }],
    } as Record<string, Rule[]>
  })
  let treeData = $ref<any[]>()
  const formRef = $ref<FormInstance>()

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType, clientCode, row) {
    initMenuTree(clientCode)
    initFormEditType(editType)
    resetForm()
    form.clientCode = clientCode
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
        form = data as Menu
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
        form = data as Menu
        confirmLoading.value = false
      }
    }
  }
  // 保存
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      if ([FormEditType.Add, FormEditType.Other].includes(formEditType.value)) {
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
      formRef?.resetFields()
    })
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
