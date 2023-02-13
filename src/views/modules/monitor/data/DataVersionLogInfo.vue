<template>
  <basic-modal
    v-bind="$attrs"
    title="查看"
    :width="960"
    :loading="confirmLoading"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions title="" :column="{ md: 2, sm: 1, xs: 1 }">
        <a-descriptions-item label="表名称">
          {{ form.tableName }}
        </a-descriptions-item>
        <a-descriptions-item label="数据名称">
          {{ form.dataName }}
        </a-descriptions-item>
        <a-descriptions-item label="数据主键">
          {{ form.dataId }}
        </a-descriptions-item>
        <a-descriptions-item label="数据版本">
          {{ form.version }}
        </a-descriptions-item>
        <a-descriptions-item label="数据内容">
          <json-preview :data="JSON.parse(form.dataContent || '{}')" />
        </a-descriptions-item>
        <a-descriptions-item label="变动前内容">
          <json-preview :data="JSON.parse(form.changeContent || '{}')" />
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import JsonPreview from '/@/components/CodeEditor/src/json-preview/JsonPreview.vue'
  import { get, DataVersionLog } from './DataVersionLog.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'

  const {
    initFormEditType,
    handleCancel,
    search,
    labelCol,
    wrapperCol,
    modalWidth,
    title,
    confirmLoading,
    visible,
    editable,
    showable,
    formEditType,
  } = useFormEdit()
  // 表单
  let form = $ref<DataVersionLog>({})
  // 入口
  function init(id) {
    visible.value = true
    getInfo(id)
  }
  // 获取信息
  function getInfo(id) {
    get(id).then(({ data }) => {
      form = data
      confirmLoading.value = false
    })
  }

  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
