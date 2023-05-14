<template>
  <basic-modal v-bind="$attrs" :loading="confirmLoading" width="50%" title="查看" :visible="visible" @cancel="visible = false">
    <a-descriptions title="" :column="{ md: 2, sm: 1, xs: 1 }">
      <a-descriptions-item label="操作人员账号">
        {{ data.username }}
      </a-descriptions-item>
      <a-descriptions-item label="操作模块">
        {{ data.title }}
      </a-descriptions-item>
      <a-descriptions-item label="业务类型">
        {{ dictConvert('LogBusinessType', data.businessType) }}
      </a-descriptions-item>
      <a-descriptions-item label="请求方式">
        {{ data.requestMethod }}
      </a-descriptions-item>
      <a-descriptions-item label="请求url">
        {{ data.operateUrl }}
      </a-descriptions-item>
      <a-descriptions-item label="操作方法">
        {{ data.method }}
      </a-descriptions-item>
      <a-descriptions-item label="操作ip">
        {{ data.operateIp }}
      </a-descriptions-item>
      <a-descriptions-item label="操作状态">
        {{ data.success ? '成功' : '失败' }}
      </a-descriptions-item>
      <a-descriptions-item label="提示消息">
        {{ data.errorMsg }}
      </a-descriptions-item>
      <a-descriptions-item label="请求参数">
        {{ data.operateParam }}
      </a-descriptions-item>
      <a-descriptions-item label="响应参数">
        {{ data.operateReturn }}
      </a-descriptions-item>
      <a-descriptions-item label="操作时间">
        {{ data.operateTime }}
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="visible = false">取消</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import { get, OperateLog } from './OperateLog.api'
  import { BasicModal } from '/@/components/Modal'
  import { DescItem } from '/@/components/Description'
  import { useDict } from '/@/hooks/bootx/useDict'

  const { dictConvert } = useDict()

  let data = $ref<OperateLog>({})
  let visible = $ref(false)
  let confirmLoading = $ref(false)
  let schema = [
    { field: 'id', label: '主键' },
    { field: 'username', label: '操作人员账号' },
    { field: 'title', label: '操作模块' },
    { field: 'client', label: '业务类型', render: (businessType) => dictConvert('LogBusinessType', businessType) },
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
    visible = true
    confirmLoading = true
    get(id).then((res) => {
      data = res.data
      confirmLoading = false
    })
  }

  defineExpose({
    show,
  })
</script>

<style lang="less" scoped></style>
