<template>
  <basic-modal
    title="查看"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions title="" :column="{ md: 2, sm: 1, xs: 1 }">
        <a-descriptions-item label="用户id">
          {{ form.userId }}
        </a-descriptions-item>
        <a-descriptions-item label="标题">
          {{ form.title }}
        </a-descriptions-item>
        <a-descriptions-item label="业务id">
          {{ form.businessId }}
        </a-descriptions-item>
        <a-descriptions-item label="金额">
          {{ form.amount }}
        </a-descriptions-item>
        <a-descriptions-item label="可退余额">
          {{ form.refundableBalance }}
        </a-descriptions-item>
        <a-descriptions-item label="支付状态">
          {{ dictConvert('PayStatus', form.payStatus) }}
        </a-descriptions-item>
        <a-descriptions-item label="是否是异步支付">
          {{ form.asyncPayMode ? '是' : '否' }}
        </a-descriptions-item>
        <a-descriptions-item label="异步支付方式">
          {{ dictConvert('PayChannel', form.asyncPayChannel) }}
        </a-descriptions-item>
        <a-descriptions-item label="支付信息">
          <a-tag v-for="o in form.payChannelInfo" :key="o.payChannel">{{ dictConvert('PayChannel', o.payChannel) }}: {{ o.amount }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="可退款信息">
          <a-tag v-for="o in form.refundableInfo" :key="o.payChannel">{{ dictConvert('PayChannel', o.payChannel) }}: {{ o.amount }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="客户IP">
          {{ form.clientIp }}
        </a-descriptions-item>
        <a-descriptions-item label="描述">
          {{ form.description }}
        </a-descriptions-item>
        <a-descriptions-item label="错误码">
          {{ form.errorCode }}
        </a-descriptions-item>
        <a-descriptions-item label="错误信息">
          {{ form.errorMsg }}
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { get, Payment } from './Payment.api'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
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
  const { dictConvert } = useDict()

  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<Payment>({
    id: '',
    userId: '',
    businessId: '',
    amount: 0,
    refundableBalance: 0,
    payStatus: 0,
    title: '',
    clientIp: '',
    description: '',
    errorCode: '',
    asyncPayMode: true,
    asyncPayChannel: 0,
    payChannelInfo: [],
    refundableInfo: [],
    payTime: '',
    expiredTime: '',
  })
  // 入口
  function init(id) {
    visible.value = true
    confirmLoading.value = true
    get(id).then(({ data }) => {
      form = data
      confirmLoading.value = false
    })
  }
  // 获取信息
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
