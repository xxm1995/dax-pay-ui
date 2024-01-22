<template>
  <basic-modal
    title="对账订单详情"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-form class="small-from-item" ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="对账日期" name="date">
        <a-date-picker
          style="width: 100%"
          valueFormat="YYYY-MM-DD"
          placeholder="请选择对账日期"
          v-model:value="form.date"
          :defaultPickerValue="form.date"
          :disabled-date="disabledDate"
          :show-today="false"
        />
      </a-form-item>
      <a-form-item label="对账通道" name="channel">
        <a-select style="width: 100%" v-model:value="form.channel" :options="channels" placeholder="请选择对账通道" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">提交</a-button>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import { BasicModal } from '/@/components/Modal'
  import { nextTick, onMounted, reactive } from 'vue'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { $ref } from 'vue/macros'
  import dayjs, { Dayjs } from 'dayjs'
  import XEUtils from 'xe-utils'
  import { create } from './ReconcileOrder.api'

  const { handleCancel, labelCol, wrapperCol, modalWidth, confirmLoading, visible, editable, showable, formEditType } = useFormEdit()
  const { createMessage } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let form = reactive({
    date: '',
    channel: null,
  })

  const rules = {
    date: [{ required: true, message: '请选择对账日期' }],
    channel: [{ required: true, message: '请选择对账通道' }],
  } as Record<string, Rule[]>

  let channels = $ref<LabeledValue[]>([])
  const formRef = $ref<FormInstance>()

  const emits = defineEmits(['ok'])

  onMounted(() => {
    initData()
  })

  /**
   * 初始化数据
   */
  async function initData() {
    channels = await dictDropDown('AsyncPayChannel')
  }

  /**
   * 入口
   */
  function init() {
    visible.value = true
    resetForm()
    const date = XEUtils.getWhatDay(new Date(), -1)
    form.date = XEUtils.toDateString(date, 'yyyy-MM-dd')
    confirmLoading.value = false
  }

  /**
   * 提交
   */
  async function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      await create(form)
      visible.value = false
      confirmLoading.value = false
      emits('ok')
    })
  }

  /**
   * 禁用今天及以后的日期
   */
  function disabledDate(current: Dayjs) {
    return current && current >= dayjs().startOf('day')
  }
  /**
   * 重置表单
   */
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  defineExpose({ init })
</script>

<style scoped lang="less"></style>
