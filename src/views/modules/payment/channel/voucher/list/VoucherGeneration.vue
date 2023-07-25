<template>
  <basic-modal
    title="储值卡生成"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="false"
    @cancel="handleCancel"
  >
    <a-form
      class="small-from-item"
      ref="formRef"
      :model="form"
      :rules="rules"
      :validate-trigger="['blur', 'change']"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="商户号" name="mchCode">
        <a-select allow-clear :options="mchList" v-model:value="form.mchCode" placeholder="请选择商户" @change="mchAppChange" />
      </a-form-item>
      <a-form-item label="应用号" name="mchAppCode" v-show="form.mchCode">
        <a-select allow-clear :options="mchAppList" v-model:value="form.mchAppCode" placeholder="请选择商户应用" />
      </a-form-item>
      <a-form-item label="面值" name="faceValue">
        <a-input-number
          :precision="2"
          :max="9999999"
          :min="0.01"
          v-model:value="form.faceValue"
          placeholder="输入储值卡面值"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="数量" name="count">
        <a-input-number
          :precision="0"
          :max="100"
          :min="1"
          v-model:value="form.count"
          placeholder="输入生成储值卡的数量"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="有效期" name="enduring">
        <a-switch checkedChildren="长期" unCheckedChildren="期限" v-model:checked="form.enduring" />
      </a-form-item>
      <a-form-item label="有效期" name="enduring" v-if="!form.enduring">
        <a-range-picker valueFormat="YYYY-MM-DD" @change="changeTime" />
      </a-form-item>
      <a-form-item label="默认状态" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio :value="VoucherEnum.STATUS_NORMAL">启用</a-radio>
          <a-radio :value="VoucherEnum.STATUS_FORBIDDEN">停用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">提交</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from 'vue/macros'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { computed, nextTick } from 'vue'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { generationBatch } from './Voucher.api'
  import { VoucherEnum } from '/@/enums/payment/voucherEnum'
  import { dropdown as mchDrop } from '/@/views/modules/payment/merchant/MerchantInfo.api'
  import { dropdown as mchAppDrop } from '/@/views/modules/payment/app/MchApplication.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'

  const { handleCancel, labelCol, wrapperCol, modalWidth, title, confirmLoading, visible, editable, showable, formEditType } = useFormEdit()
  const { createMessage } = useMessage()

  // 商户和应用下拉列表
  let mchList = $ref<LabeledValue[]>()
  let mchAppList = $ref<LabeledValue[]>()

  // 表单
  const formRef = $ref<FormInstance>()
  const form = $ref({
    mchCode: undefined,
    mchAppCode: undefined,
    count: 1,
    faceValue: 1,
    dataTime: null,
    enduring: true,
    startTime: null,
    endTime: null,
    status: VoucherEnum.STATUS_NORMAL,
  })

  const rules = {
    mchCode: [{ required: true, message: '请选择商户' }],
    mchAppCode: [{ required: true, message: '请选择商户对应的应用' }],
    count: [{ required: true, message: '请输入要生成的数量' }],
    faceValue: [{ required: true, message: '请输入储值卡的面值' }],
    enduring: [{ required: true, message: '请选择储值卡有效期类型' }],
    dataTime: [{ required: form.enduring, message: '请选择有效时间范围' }],
    status: [{ required: true, message: '请选择默认状态' }],
  } as Record<string, Rule[]>

  const emits = defineEmits(['ok'])

  /**
   * 初始化
   */
  function init() {
    visible.value = true
    resetForm()
    // 商户下拉列表
    mchDrop().then(({ data }) => {
      mchList = data
    })
    confirmLoading.value = false
  }

  /**
   * 商户应用下拉列表
   */
  function mchAppChange() {
    mchAppDrop(form.mchCode).then(({ data }) => {
      mchAppList = data
    })
  }

  /**
   * 时间范围变动
   */
  function changeTime(_, times) {
    form.startTime = (times[0] + ' 00:00:00') as any
    form.endTime = (times[1] + ' 23:59:59') as any
  }

  /**
   * 生成储值卡
   */
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      form.dataTime = null
      if (form.enduring) {
        form.startTime = null
        form.endTime = null
      }
      await generationBatch(form)
      visible.value = false
      confirmLoading.value = false
      emits('ok')
    })
  }
  // 重置表单
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  defineExpose({ init })
</script>

<style scoped></style>
