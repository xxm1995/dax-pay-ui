<template>
  <a-card :bordered="false">
    <a-spin :spinning="loading">
      <div>
        <a-form ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="异步支付方式" name="payChannel">
            <a-radio-group v-model:value="form.payChannel" :default-value="1" button-style="solid">
              <a-radio-button v-for="o in payChannel" :value="o.code" :key="o.code"> {{ o.label }} </a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="订单编号" name="businessId">
            <a-input v-model:value="form.businessId" @search="genOrderNo">
              <template #addonAfter>
                <a-button type="link" size="small" @click="genOrderNo"> 生成订单号 </a-button>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="订单名称" name="title">
            <a-input v-model:value="form.title" />
          </a-form-item>
          <a-form-item label="异步支付金额" name="asyncAmount">
            <a-input-number placeholder="请输入金额" :precision="2" v-model:value="form.asyncAmount" />
          </a-form-item>
          <a-form-item label="钱包支付" name="walletAmount">
            <a-input-number placeholder="请输入金额" :precision="2" v-model:value="form.walletAmount" />
            <template #help>
              <span>钱包余额：{{ wallet.balance }}</span>
            </template>
          </a-form-item>
          <a-form-item label="现金支付" name="cashAmount">
            <a-input-number placeholder="请输入金额" :precision="2" v-model:value="form.cashAmount" />
          </a-form-item>
        </a-form>
      </div>
      <div style="display: flex; justify-content: center">
        <a-button type="primary" @click="pay"> 发起支付 </a-button>
      </div>
    </a-spin>
    <!--  扫码弹出窗口  -->
    <cashier-qr-code ref="cashierQrCode" @cancel="handleCancel" />
  </a-card>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import { combinationPay, findStatusByBusinessId, findWalletByUser } from '/@/views/demo/payment/cashier/Cashier.api'
  import { Voucher } from '/@/views/modules/payment/voucher/Voucher.api'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { useIntervalFn } from '@vueuse/core'
  import { onMounted } from 'vue'
  import CashierQrCode from './CashierQrCode.vue'

  const { createMessage } = useMessage()

  const formRef = $ref<FormInstance>()
  const cashierQrCode = $ref<any>()

  const labelCol = {
    sm: { span: 7 },
  }
  const wrapperCol = {
    sm: { span: 13 },
  }
  const payChannel = [
    { code: 1, label: '支付宝' },
    { code: 2, label: '微信' },
  ]
  let loading = $ref(false)
  let visible = $ref(false)
  let wallet = $ref({ balance: 0 })
  let voucher = $ref<Voucher>({})
  let form = $ref({
    payChannel: 1,
    payWay: 4,
    businessId: '',
    title: '测试支付订单',
    asyncAmount: null,
    walletAmount: null,
    cashAmount: null,
  })
  const rules = {
    payChannel: [{ required: true, message: '不可为空' }],
    businessId: [{ required: true, message: '不可为空' }],
    title: [{ required: true, message: '不可为空' }],
    payWay: [{ required: true, message: '不可为空' }],
  }

  // 检查支付状态
  const { pause, resume } = useIntervalFn(
    () => {
      findStatusByBusinessId(form.businessId).then((res) => {
        // 成功
        if (res.data === 1) {
          createMessage.success('支付成功')
          handleCancel()
        }
        if ([2, 3].includes(res.data)) {
          createMessage.error('支付失败')
          handleCancel()
        }
      })
    },
    1000 * 3,
    { immediate: false },
  )

  onMounted(() => {
    init()
  })

  function init() {
    findWalletByUser().then(({ data }) => {
      wallet = data
    })
    genOrderNo()
  }
  // 生成订单号
  function genOrderNo() {
    form.businessId = 'P' + new Date().getTime()
  }

  function pay() {
    formRef?.validate().then(async () => {
      loading = true
      // 组装支付参数
      const payModeList = [
        { payChannel: form.payChannel, payWay: form.payWay, amount: form.asyncAmount },
        { payChannel: 4, amount: form.cashAmount },
        { payChannel: 5, amount: form.walletAmount },
      ]
      // 异步
      const { data } = await combinationPay({
        title: form.title,
        businessId: form.businessId,
        payModeList: payModeList,
      }).finally(() => (loading = false))
      // 同步还是异步支付
      if (data.asyncPayMode) {
        if (data.payChannel === 1) {
          cashierQrCode.init(data.asyncPayInfo.payBody, '请使用支付宝"扫一扫"扫码支付')
        } else {
          cashierQrCode.init(data.asyncPayInfo.payBody, '请使用微信"扫一扫"扫码支付')
        }
        loading = false
        resume()
      } else {
        createMessage.success('支付成功')
      }
    })
  }

  function handleCancel() {
    cashierQrCode.handleClose()
    loading = false
    genOrderNo()
    pause()
  }
</script>

<style scoped></style>
