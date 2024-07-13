<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    width="50%"
    title="查看"
    :open="visible"
    @cancel="visible = false"
  >
    <description :column="2" :data="data" :schema="schema" />
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="visible = false">取消</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { get, OperateLog } from './OperateLog.api'
  import { BasicModal } from '@/components/Modal'
  import { DescItem, Description } from '@/components/Description'
  import { useDict } from '@/hooks/bootx/useDict'
  import { ref } from 'vue'

  const { dictConvert } = useDict()

  let data = ref<OperateLog>({})
  let visible = ref(false)
  let confirmLoading = ref(false)
  let schema = [
    { field: 'id', label: '主键' },
    { field: 'account', label: '操作账号' },
    { field: 'title', label: '操作模块' },
    {
      field: 'client',
      label: '业务类型',
      render: (businessType) => dictConvert('LogBusinessType', businessType),
    },
    { field: 'requestMethod', label: '请求方式' },
    { field: 'operateUrl', label: '请求url' },
    { field: 'method', label: '操作方法' },
    { field: 'success', label: '操作状态', render: (success) => (success ? '成功' : '失败') },
    { field: 'errorMsg', label: '提示消息' },
    { field: 'operateParam', label: '请求参数' },
    { field: 'operateReturn', label: '响应参数' },
    { field: 'operateTime', label: '操作时间' },
  ] as DescItem[]

  function show(id) {
    visible.value = true
    confirmLoading.value = true
    get(id).then((res) => {
      data.value = res.data
      confirmLoading.value = false
    })
  }

  defineExpose({
    show,
  })
</script>

<style lang="less" scoped></style>
