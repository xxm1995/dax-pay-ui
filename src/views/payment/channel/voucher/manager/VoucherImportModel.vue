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
      <a-form-item label="卡号" name="cardNo">
        <a-input v-model:value="form.cardNo" placeholder="输入储值卡卡号" />
      </a-form-item>

      <a-form-item label="面值(分)" name="faceValue">
        <a-input-number
          :precision="0"
          :max="9999999"
          :min="1"
          v-model:value="form.faceValue"
          placeholder="输入储值卡面值(分)"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="余额(分)" name="balance">
        <a-input-number
          :precision="0"
          :max="form.faceValue"
          :min="1"
          v-model:value="form.balance"
          placeholder="输入储值卡面值(分)"
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

<script setup lang="ts">
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from 'vue/macros'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { computed, nextTick } from 'vue'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { VoucherEnum } from '/@/enums/payment/voucherEnum'
  import { voucherImport } from '/@/views/payment/channel/voucher/manager/Voucher.api'

  const { handleCancel, labelCol, wrapperCol, modalWidth, title, confirmLoading, visible, editable, showable, formEditType } = useFormEdit()
  const { createMessage } = useMessage()

  // 表单
  const formRef = $ref<FormInstance>()
  const form = $ref({
    faceValue: 2000,
    balance: 2000,
    enduring: true,
    dataTime: null,
    startTime: null,
    endTime: null,
    status: VoucherEnum.STATUS_NORMAL,
  })

  const rules = computed<Record<string, Rule[]>>(() => {
    return {
      cardNo: [{ required: true, message: '请输入储值卡卡号' }],
      faceValue: [{ required: true, message: '请输入储值卡的面值' }],
      balance: [{ required: true, message: '请输入储值卡的余额' }],
      enduring: [{ required: true, message: '请选择储值卡有效期类型' }],
      dataTime: [{ required: form.enduring, message: '请选择有效时间范围' }],
      status: [{ required: true, message: '请选择默认状态' }],
    }
  })

  const emits = defineEmits(['ok'])

  /**
   * 初始化
   */
  function init() {
    visible.value = true
    resetForm()
    confirmLoading.value = false
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
      await voucherImport(form)

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

<style scoped lang="less"></style>
