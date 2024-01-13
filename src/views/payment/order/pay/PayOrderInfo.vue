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
        <a-descriptions-item label="支付ID">
          {{ order.id }}
        </a-descriptions-item>
        <a-descriptions-item label="业务号">
          {{ order.businessNo }}
        </a-descriptions-item>
        <a-descriptions-item label="标题">
          {{ order.title }}
        </a-descriptions-item>
        <a-descriptions-item label="描述">
          {{ orderExtra.description }}
        </a-descriptions-item>
        <a-descriptions-item label="金额">
          {{ order.amount }}
        </a-descriptions-item>
        <a-descriptions-item label="可退余额">
          {{ order.refundableBalance }}
        </a-descriptions-item>
        <a-descriptions-item label="支付状态">
          <a-tag>{{ dictConvert('PayStatus', order.status) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="异步支付">
          {{ order.asyncPay ? '是' : '否' }}
        </a-descriptions-item>
        <a-descriptions-item label="组合支付">
          {{ order.combinationPay ? '是' : '否' }}
        </a-descriptions-item>
        <a-descriptions-item label="异步支付方式">
          {{ dictConvert('PayChannel', order.asyncChannel) }}
        </a-descriptions-item>
        <a-descriptions-item label="支付信息">
          <a-tag v-for="o in orderChannel" :key="o.channel">{{ dictConvert('PayChannel', o.channel) }}: {{ o.amount }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="可退款信息">
          <a-tag v-for="o in order.refundableInfos" :key="o.channel">{{ dictConvert('PayChannel', o.channel) }}: {{ o.amount }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="客户IP">
          {{ orderExtra.clientIp }}
        </a-descriptions-item>
        <a-descriptions-item label="错误信息">
          {{ orderExtra.errorMsg }}
        </a-descriptions-item>
        <a-descriptions-item label="是否通知">
          {{ orderExtra.notNotify ? '否' : '是' }}
        </a-descriptions-item>
        <a-descriptions-item label="通知地址">
          {{ orderExtra.notifyUrl }}
        </a-descriptions-item>
        <a-descriptions-item label="签名类型">
          {{ orderExtra.signType }}
        </a-descriptions-item>
        <a-descriptions-item label="签名">
          {{ orderExtra.sign }}
        </a-descriptions-item>
        <a-descriptions-item label="商户扩展参数">
          {{ orderExtra.attach }}
        </a-descriptions-item>
        <a-descriptions-item label="请求时间">
          {{ orderExtra.reqTime }}
        </a-descriptions-item>
        <a-descriptions-item label="支付时间">
          {{ order.payTime }}
        </a-descriptions-item>
        <a-descriptions-item label="过期时间">
          {{ order.expiredTime }}
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
  import { getOrder, PayOrder, PayOrderExtra, PayOrderChannel, getOrderExtra, getPayChannel } from './PayOrder.api'
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

  let order = $ref<PayOrder>({})
  let orderExtra = $ref<PayOrderExtra>({})
  let orderChannel = $ref<PayOrderChannel[]>([])
  // 入口
  async function init(id) {
    visible.value = true
    confirmLoading.value = true
    await getOrder(id).then(({ data }) => {
      order = data
    })
    await getOrderExtra(id).then(({ data }) => {
      orderExtra = data
    })
    await getPayChannel(id).then(({ data }) => {
      orderChannel = data
    })
    confirmLoading.value = false
  }
  // 获取信息
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
