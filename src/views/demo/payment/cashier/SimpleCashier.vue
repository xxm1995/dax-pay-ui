<template>
  <a-card :bordered="false">
    <a-spin :spinning="loading">
      <div>
        <a-form ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="支付方式" name="payChannel">
            <a-radio-group v-model:value="form.payChannel" button-style="solid">
              <a-radio-button v-for="o in payChannel" :value="o.code" :key="o.code"> {{ o.name }} </a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="订单编号" name="businessId">
            <a-input v-model:value="form.businessId">
              <template #addonAfter>
                <a-button type="link" size="small" @click="genOrderNo"> 生成订单号 </a-button>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="订单名称" name="title">
            <a-input v-model:value="form.title" />
          </a-form-item>
          <a-form-item label="金额" name="amount">
            <a-input-number :precision="2" :min="0.01" v-model:value="form.amount" />
          </a-form-item>
          <a-form-item label="储值卡" name="voucherNo" v-if="form.payChannel === payChannelEnum.VOUCHER">
            <a-input v-model:value="form.voucherNo" @blur="getVoucher" />
            <template #help>
              <span>储值卡面值：{{ voucher.faceValue }} 余额：{{ voucher.balance }}</span>
            </template>
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
  import { onMounted } from 'vue'
  import { findStatusByBusinessId, findWalletByUser, singlePay } from '/@/views/demo/payment/cashier/Cashier.api'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { useIntervalFn } from '@vueuse/core'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { findByCardNo, Voucher } from '/@/views/modules/payment/voucher/Voucher.api'
  import CashierQrCode from './CashierQrCode.vue'
  import { payChannelEnum } from '/@/enums/payment/payChannelEnum'
  import { findByParamKey } from '/@/api/common/Parameter'
  import { payWayEnum } from '/@/enums/payment/payWayEnum'
  import { PayStatus } from "/@/enums/payment/PayStatus";

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
    { code: payChannelEnum.ALI, name: '支付宝' },
    { code: payChannelEnum.WECHAT, name: '微信' },
    // { code: 3, name: '云闪付' },
    // { code: 5, name: '钱包' },
    { code: payChannelEnum.VOUCHER, name: '储值卡' },
  ]
  let loading = $ref(false)
  let visible = $ref(false)
  // let wallet = $ref({ balance: 0 })
  let voucher = $ref<Voucher>({})
  let form = $ref({
    payChannel: payChannelEnum.ALI,
    payWay: payWayEnum.QRCODE,
    businessId: '',
    voucherNo: '',
    title: '测试支付订单',
    // 二维码支付方式
    amount: 0.01,
    mchCode: '',
    mchAppCode: '',
  })
  const rules = {
    payChannel: [{ required: true, message: '不可为空' }],
    businessId: [{ required: true, message: '不可为空' }],
    title: [{ required: true, message: '不可为空' }],
    payWay: [{ required: true, message: '不可为空' }],
    amount: [{ required: true, message: '不可为空' }],
    voucherNo: [{ required: true, message: '不可为空' }],
  }

  // 检查支付状态
  const { pause, resume } = useIntervalFn(
    () => {
      findStatusByBusinessId(form.businessId).then((res) => {
        // 成功
        if (res.data === PayStatus.TRADE_SUCCESS) {
          createMessage.success('支付成功')
          handleCancel()
        }
        if ([PayStatus.TRADE_FAIL, PayStatus.TRADE_CANCEL].includes(res.data)) {
          createMessage.error('支付失败')
          handleCancel()
        }
      })
    },
    1000 * 3,
    { immediate: false },
  )

  onMounted(() => {
    initData()
  })

  /**
   * 初始化数据
   */
  async function initData() {
    // 获取钱包
    // findWalletByUser().then((res) => {
    //   wallet = res.data
    // })
    genOrderNo()
    // 获取商户和应用编码
    form.mchCode = (await findByParamKey('CashierMchCode')).data
    form.mchAppCode = (await findByParamKey('CashierMchAppCode')).data
  }

  // 生成订单号
  function genOrderNo() {
    form.businessId = 'P' + new Date().getTime()
  }

  // 发起支付
  function pay() {
    formRef?.validate().then(async () => {
      loading = true
      const { data } = await singlePay(form).finally(() => (loading = false))

      // 是否异步支付
      if (data.asyncPayMode) {
        console.log(data.asyncPayChannel)
        if (data.asyncPayChannel === payChannelEnum.ALI) {
          cashierQrCode.init(data.asyncPayInfo.payBody, '请使用支付宝"扫一扫"扫码支付')
        } else {
          cashierQrCode.init(data.asyncPayInfo.payBody, '请使用微信"扫一扫"扫码支付')
        }
        resume()
      } else {
        createMessage.success('支付成功')
        pause()
      }
    })
  }
  // 获取储值卡信息
  function getVoucher() {
    if (form.voucherNo) {
      findByCardNo(form.voucherNo).then(({ data }) => {
        voucher = data
      })
    }
  }

  function handleCancel() {
    cashierQrCode.handleClose()
    loading = false
    genOrderNo()
    pause()
  }
</script>

<style scoped></style>
