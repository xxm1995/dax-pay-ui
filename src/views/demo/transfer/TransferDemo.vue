<template>
  <div class="mt-15px mb-15px" style="display: flex; flex-direction: row; height: 768px; margin: 20px; padding: 15px; background: white">
    <a-form ref="formRef" class="small-from-item" :model="form" :rules="rules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
      <a-form-item>
        <span style="font-size: 24px; font-weight: bold; margin-bottom: 20px">转账测试</span>
      </a-form-item>
      <a-spin :spinning="loading">
        <a-form-item label="订单号" name="bizTransferNo">
          <a-input v-model:value="form.bizTransferNo" placeholder="请输入订单号" style="width: 250px" />
          <a-button type="primary" @click="genBizOrderNo">生成</a-button>
        </a-form-item>
        <a-form-item label="标题" name="title">
          <a-input v-model:value="form.title" placeholder="请输入标题" />
        </a-form-item>
        <a-form-item label="金额" name="amount">
          <a-input-number v-model:value="form.amount" :min="0.01" :max="1000000" :precision="2" />
        </a-form-item>
        <a-form-item label="转账原因" name="reason">
          <a-input :maxlength="150" v-model:value="form.reason" placeholder="请输入转账原因" />
        </a-form-item>
        <a-form-item label="通道" name="channel">
          <a-radio-group v-model:value="form.channel" button-style="solid" @change="channelChange">
            <a-radio-button disabled :value="payChannelEnum.WECHAT">微信</a-radio-button>
            <a-radio-button :value="payChannelEnum.ALI">支付宝</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="账号类型" name="payeeType">
          <a-select v-model:value="form.payeeType" :options="payeeTypeList" placeholder="请选择收款人账号类型" allow-clear />
        </a-form-item>
        <a-form-item label="收款方账号" name="payeeAccount">
          <a-input v-model:value="form.payeeAccount" placeholder="请输入收款方账号" />
        </a-form-item>
      </a-spin>
      <a-form-item>
        <a-button style="margin-left: auto" type="primary" @click="submitForm">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { payChannelEnum } from '/@/enums/payment/payChannelEnum'
  import { onMounted, reactive, ref } from 'vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { transfer } from '/@/views/demo/transfer/TransferDemo.api'
  import { useMessage } from '/@/hooks/web/useMessage'

  const { createMessage } = useMessage()
  const formRef = ref<FormInstance>()
  const loading = ref<boolean>(false)
  const form = reactive({
    bizTransferNo: '',
    channel: payChannelEnum.ALI,
    amount: 0.01,
    title: '',
    reason: '',
    // transferType: undefined,
    payeeType: undefined,
    payeeAccount: '',
    payeeName: '',
  })

  const rules = reactive({
    bizTransferNo: [{ required: true, message: '请输入订单号' }],
    channel: [{ required: true, message: '请选择通道' }],
    amount: [{ required: true, message: '请输入金额' }],
    payeeType: [{ required: true, message: '请选择收款方类型' }],
    payeeAccount: [{ required: true, message: '请输入收款方账号' }],
    title: [{ required: true, message: '请输入标题' }],
  })

  // 收款人账号类型
  const payeeTypeList = ref<LabeledValue[]>([
    { label: '用户ID', value: 'ali_user_id' },
    { label: 'OpenId', value: 'ali_open_id' },
    { label: '账号', value: 'ali_login_name' },
  ])

  onMounted(() => {
    genBizOrderNo()
  })

  function channelChange() {}

  /**
   * 生成业务号
   */
  function genBizOrderNo() {
    form.bizTransferNo = 'T' + new Date().getTime()
  }

  /**
   * 提交
   */
  function submitForm() {
    formRef.value?.validate().then(async () => {
      loading.value = true
      transfer({
        ...form,
        amount: form.amount * 100,
      })
        .then(({ data }) => {
          if (data.status == 'fail') {
            createMessage.error('转账失败, 请排查')
          } else {
            createMessage.success('转账请求发起成功')
          }
        })
        .finally(() => {
          genBizOrderNo()
          // formRef.value?.resetFields()
          loading.value = false
        })
    })
  }
</script>

<style scoped lang="less"></style>
