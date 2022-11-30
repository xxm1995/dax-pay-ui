<template>
  <basic-modal
    title="超级查询器"
    v-bind="$attrs"
    okText="查询"
    cancelText="关闭"
    :loading="confirmLoading"
    :mask-closable="false"
    :width="width"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-spin :spinning="confirmLoading">
      <a-form>
        <div>
          <a-row type="flex" style="margin-bottom: 15px" :gutter="16">
            <a-col :span="12">
              <a-button @click="handleAdd" type="primary">添加条件</a-button>
              <a-popconfirm title="是否清空所有查询条件" @confirm="handleReset" okText="是" cancelText="否">
                <a-button v-if="queryParams.length" style="margin-left: 10px" type="danger">清空条件</a-button>
              </a-popconfirm>
            </a-col>
          </a-row>
          <super-query-item v-model:query-params="queryParams" :fields="fields" />
        </div>
      </a-form>
    </a-spin>
  </basic-modal>
</template>

<script lang="ts" setup>
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import SuperQueryItem from '/@/components/Bootx/SuperQuery/SuperQueryItem.vue'
  import { $ref } from 'vue/macros'
  import { QueryField, QueryParam } from '/@/components/Bootx/Query/Query'
  import { watch } from "vue";

  interface Props {
    fields: QueryField[]
    modelTitle: string
    width: number
  }
  const props = withDefaults(defineProps<Props>(), {})

  const emits = defineEmits(['ok', 'close'])

  // 显示
  let visible = $ref(false)
  // 查询条件
  let queryParams = $ref<QueryParam[]>([])
  const confirmLoading = $ref(false)

  // 显示
  function show() {
    visible = true
  }
  // 关闭
  function handleCancel() {
    emits('close')
    visible = false
  }
  // 确定
  function handleOk() {
    emits('ok', queryParams)
  }
  // 添加条件
  function handleAdd() {
    queryParams.push({
      compareType: 'eq',
      or: 'false',
    })
  }
  // 清空条件
  function handleReset() {
    queryParams = []
  }
  defineExpose({ show, handleReset })
</script>

<style scoped></style>
