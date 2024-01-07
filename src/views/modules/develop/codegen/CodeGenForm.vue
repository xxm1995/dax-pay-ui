<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    title="代码生成参数配置"
    width="40%"
    :destroyOnClose="true"
    :maskClosable="false"
    :visible="visible"
    @close="handleCancel"
  >
    <a-form ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="功能模块名称" name="module">
        <a-input-group compact>
          <a-input v-model:value="form.module" style="width: calc(100% - 115px)" />
          <a-button type="primary" @click="genParams">生成其他参数</a-button>
        </a-input-group>
      </a-form-item>
      <a-form-item label="基础包名称" name="basePack">
        <a-input v-model:value="form.basePack" />
      </a-form-item>
      <a-form-item label="实体类名称" name="entityName">
        <a-input v-model:value="form.entityName" />
      </a-form-item>
      <a-form-item label="vue版本" name="vueVersion">
        <a-select v-model:value="form.vueVersion" :default-value="form.vueVersion" style="width: 100%" placeholder="选择vue版本">
          <a-select-option key="v3">Vue3</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="编辑窗类型" name="editType">
        <a-select v-model:value="form.editType" :default-value="form.baseEntity" style="width: 100%" placeholder="选择基类">
          <a-select-option key="modal">弹窗</a-select-option>
          <a-select-option key="drawer">抽屉</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="删除类型" name="deleteType">
        <a-select v-model:value="form.deleteType" :default-value="form.baseEntity" style="width: 100%" placeholder="选择基类">
          <a-select-option key="popconfirm">气泡确认</a-select-option>
          <a-select-option key="confirm">弹窗确认</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="基类" name="baseEntity">
        <a-select v-model:value="form.baseEntity" :default-value="form.baseEntity" style="width: 100%" placeholder="选择基类">
          <a-select-option key="MpBaseEntity">MpBaseEntity</a-select-option>
          <a-select-option key="MpDelEntity">MpDelEntity</a-select-option>
          <a-select-option key="MpCreateEntity">MpCreateEntity</a-select-option>
          <a-select-option key="MpIdEntity">MpIdEntity</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="创建人" name="author">
        <a-input v-model:value="form.author" />
      </a-form-item>
      <template v-if="genPackFlag">
        <a-form-item label="请求地址" name="baseEntity">
          <a-input v-model:value="form.requestPath" />
        </a-form-item>
        <a-form-item label="接口文件目录" name="vueApiPath">
          <a-input v-model:value="form.vueApiPath" />
        </a-form-item>
        <a-form-item label="core包路径" name="corePack">
          <a-input v-model:value="form.corePack" />
        </a-form-item>
        <a-form-item label="dto包路径" name="dtoPack">
          <a-input v-model:value="form.dtoPack" />
        </a-form-item>
        <a-form-item label="参数包路径" name="paramPack">
          <a-input v-model:value="form.paramPack" />
        </a-form-item>
      </template>
    </a-form>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" type="primary" :disabled="!genPackFlag" @click="handleOk">生成</a-button>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { getTableGenParam } from './CodeGen.api'
  import { $ref } from 'vue/macros'
  import { nextTick } from 'vue'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'

  const { labelCol, wrapperCol, visible } = useFormEdit()

  const form = $ref({
    basePack: 'cn.bootx.platform',
    module: '',
    dataSourceCode: '',
    tableName: '',
    entityName: '',
    baseEntity: 'MpBaseEntity',
    vueVersion: 'v3',
    corePack: '',
    editType: 'modal',
    deleteType: 'confirm',
    paramPack: '',
    dtoPack: '',
    controllerPack: '',
    requestPath: '',
    vueApiPath: '',
    author: 'xxm',
  })
  const rules = {}

  let genType = $ref('down' as 'down' | 'preview')
  let genPackFlag = $ref(false)
  let formRef = $ref<FormInstance>()

  const emits = defineEmits(['down', 'preview'])

  function show(dataSourceCode, tableName, type: 'down' | 'preview') {
    visible.value = true
    form.tableName = tableName
    form.dataSourceCode = dataSourceCode
    genType = type
    genPackFlag = false
    getGenConfigParam()
  }
  // 确定
  function handleOk() {
    formRef?.validate().then(() => {
      emits(genType, form)
    })
  }
  /**
   * 获取代码生成配置信息
   */
  async function getGenConfigParam() {
    // 获取功能模块名称
    const { data } = await getTableGenParam(form.dataSourceCode, form.tableName)
    form.entityName = data.entityName
    form.module = data.module
  }
  /**
   * 生成代码生成参数参数
   */
  function genParams() {
    const { basePack, module } = form
    // 包名
    form.corePack = `${basePack}.core.${module}`
    form.paramPack = `${basePack}.param.${module}`
    form.dtoPack = `${basePack}.dto.${module}`
    form.controllerPack = `${basePack}.controller`

    form.requestPath = `/${module}`
    form.vueApiPath = `/api/${module}`
    genPackFlag = true
  }
  function handleCancel() {
    resetForm()
    visible.value = false
  }
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  defineExpose({
    show,
  })
</script>

<style scoped></style>
