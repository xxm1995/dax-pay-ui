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
            <a-input v-model:value="form.businessId" placeholder="请输入订单编号">
              <template #addonAfter>
                <a-button type="link" size="small" @click="genOrderNo"> 生成订单号 </a-button>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="订单名称" name="title">
            <a-input v-model:value="form.title" placeholder="请输入金额" />
          </a-form-item>
          <a-form-item label="金额" name="amount">
            <a-input-number :precision="2" :min="0.01" v-model:value="form.amount" placeholder="请输入金额" />
            <template v-if="form.payChannel === payChannelEnum.WALLET" #help>
              <span>钱包余额：{{ wallet.balance }}</span>
            </template>
          </a-form-item>
          <a-form-item label="储值卡" name="voucherNo" v-if="form.payChannel === payChannelEnum.VOUCHER">
            <a-input v-model:value="form.voucherNo" @blur="getVoucher" placeholder="请输入储值卡号" />
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
  import { findStatusByBusinessId, singlePay } from '/@/views/demo/payment/cashier/Cashier.api'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { useIntervalFn } from '@vueuse/core'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { getAndJudgeVoucher, Voucher } from '/@/views/modules/payment/channel/voucher/list/Voucher.api'
  import CashierQrCode from './CashierQrCode.vue'
  import { payChannelEnum } from '/@/enums/payment/payChannelEnum'
  import { findByParamKey } from '/@/api/common/Parameter'
  import { payWayEnum } from '/@/enums/payment/payWayEnum'
  import { PayStatus } from '/@/enums/payment/PayStatus'
  import { findByUser as findWalletByUser, Wallet } from '/@/views/modules/payment/channel/wallet/Wallet.api'
  import { LabeledValue } from "ant-design-vue/lib/select";

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
    { code: payChannelEnum.WALLET, name: '钱包' },
    { code: payChannelEnum.VOUCHER, name: '储值卡' },
  ]
  let loading = $ref(false)
  let visible = $ref(false)
  let wallet = $ref<Wallet>({ balance: 0 })
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
    payChannel: [{ required: true, message: '支付通道不可为空' }],
    businessId: [{ required: true, message: '业务不可为空' }],
    title: [{ required: true, message: '标题不可为空' }],
    payWay: [{ required: true, message: '支付方式不可为空' }],
    amount: [{ required: true, message: '金额不可为空' }],
    voucherNo: [{ required: true, message: '储值卡号不可为空' }],
  }
  // 商户和应用下拉列表
  let mchList = $ref<LabeledValue[]>()
  let mchAppList = $ref<LabeledValue[]>()

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
  // 页面加载钩子
  onMounted(() => {
    initData()
  })

  /**
   * 初始化数据
   */
  async function initData() {
    // 生成订单号
    genOrderNo()
    // 获取商户和应用编码
    form.mchCode = (await findByParamKey('CashierMchCode')).data
    form.mchAppCode = (await findByParamKey('CashierMchAppCode')).data
    // 初始化钱包信息
    getWallet()
  }

  /**
   * 获取钱包信息
   */
  function getWallet() {
    // 获取钱包
    findWalletByUser({
      mchCode: form.mchCode,
      mchAppCode: form.mchAppCode,
    }).then((res) => {
      wallet = res.data
    })
  }

  /**
   * 获取储值卡信息
   */
  function getVoucher() {
    if (form.voucherNo) {
      getAndJudgeVoucher({ cardNo: form.voucherNo }).then(({ data }) => {
        // 储值卡是否属于当前商户
        if (data.mchCode !== form.mchCode || data.mchAppCode !== form.mchAppCode) {
          createMessage.warn('储值卡当前商户无法使用')
        } else {
          voucher = data
        }
      })
    }
  }

  /**
   * 生成订单号
   */
  function genOrderNo() {
    form.businessId = 'P' + new Date().getTime()
  }

  /**
   * 发起支付
   */
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
        getWallet()
        genOrderNo()
        getVoucher()
        pause()
      }
    })
  }

  /**
   * 关闭扫码弹窗
   */
  function handleCancel() {
    cashierQrCode.handleClose()
    loading = false
    genOrderNo()
    getVoucher()
    pause()
  }
</script>

<style scoped></style>
