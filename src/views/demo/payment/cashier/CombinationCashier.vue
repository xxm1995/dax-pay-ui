<template>
  <a-card :bordered="false">
    <a-spin :spinning="loading">
      <div>
        <a-form ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="商户号" name="mchCode">
            <a-select allow-clear :options="mchList" v-model:value="form.mchCode" placeholder="请选择商户" @change="mchAppChange" />
          </a-form-item>
          <a-form-item label="应用号" name="mchAppCode" v-show="form.mchCode">
            <a-select allow-clear :options="mchAppList" v-model:value="form.mchAppCode" placeholder="请选择商户应用" @change="getWallet" />
          </a-form-item>
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
          <a-form-item label="微信/支付宝金额" name="asyncAmount">
            <a-input-number placeholder="请输入金额" :precision="2" :min="0" v-model:value="form.asyncAmount" />
          </a-form-item>
          <a-form-item label="现金支付" name="cashAmount">
            <a-input-number placeholder="请输入金额" :precision="2" :min="0" v-model:value="form.cashAmount" />
          </a-form-item>
          <a-form-item label="钱包支付" name="walletAmount">
            <a-input-number
              placeholder="请输入金额"
              :disabled="!wallet"
              :precision="2"
              :max="wallet?.balance"
              :min="0"
              v-model:value="form.walletAmount"
            />
            <template #help>
              <span v-if="wallet">钱包余额：{{ wallet.balance }}</span>
              <span v-else>用户钱包不存在或者未开通</span>
            </template>
          </a-form-item>
          <a-form-item label="储值卡卡号" name="voucherNo">
            <a-input v-model:value="form.voucherNo" @blur="getVoucher" placeholder="请输入储值卡号" />
            <template #help>
              <span v-if="voucher">储值卡面值：{{ voucher.faceValue }} 余额：{{ voucher.balance }}</span>
              <span v-else>{{ voucherWarn }}</span>
            </template>
          </a-form-item>
          <a-form-item label="储值卡支付" name="voucherAmount">
            <a-input-number
              placeholder="请输入金额"
              :disabled="!voucher"
              :max="voucher?.balance"
              :min="0"
              :precision="2"
              v-model:value="form.voucherAmount"
            />
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
  import { combinationPay, findStatusByBusinessId } from '/@/views/demo/payment/cashier/Cashier.api'
  import { getAndJudgeVoucher, Voucher } from '/@/views/modules/payment/channel/voucher/list/Voucher.api'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { useIntervalFn } from '@vueuse/core'
  import { onMounted } from 'vue'
  import CashierQrCode from './CashierQrCode.vue'
  import { payChannelEnum } from '/@/enums/payment/payChannelEnum'
  import { payWayEnum } from '/@/enums/payment/payWayEnum'
  import { findByParamKey } from '/@/api/common/Parameter'
  import { PayStatus } from '/@/enums/payment/PayStatus'
  import { findByUser as findWalletByUser, Wallet } from '/@/views/modules/payment/channel/wallet/Wallet.api'
  import { dropdown as mchDrop } from '/@/views/modules/payment/merchant/MerchantInfo.api'
  import { dropdown as mchAppDrop } from '/@/views/modules/payment/app/MchApplication.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'

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
    { code: payChannelEnum.ALI, label: '支付宝' },
    { code: payChannelEnum.WECHAT, label: '微信' },
  ]
  let loading = $ref(false)
  let visible = $ref(false)
  let voucher = $ref<Voucher>()
  let wallet = $ref<Wallet>()
  let form = $ref({
    payChannel: payChannelEnum.ALI,
    payWay: payWayEnum.QRCODE,
    businessId: '',
    title: '测试支付订单',
    asyncAmount: 0,
    walletAmount: 0,
    voucherAmount: 0,
    cashAmount: 0,
    voucherNo: null,
    mchCode: '',
    mchAppCode: '',
  })
  const rules = {
    mchCode: [{ required: true, message: '请选择商户' }],
    mchAppCode: [{ required: true, message: '请选择商户对应的应用' }],
    payChannel: [{ required: true, message: '支付通道不可为空' }],
    businessId: [{ required: true, message: '业务ID不可为空' }],
    title: [{ required: true, message: '金额不可=不可为空' }],
    payWay: [{ required: true, message: '支付方式不可为空' }],
  }
  let voucherWarn = $ref('')
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

  onMounted(() => {
    init()
  })

  /**
   * 商户应用下拉列表
   */
  function mchAppChange() {
    mchAppDrop(form.mchCode).then(({ data }) => {
      form.mchAppCode = ''
      mchAppList = data
    })
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
      if (res.data) {
        wallet = res.data
      } else {
        wallet = null as any
        form.walletAmount = 0
      }
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
          voucher = null as any
          voucherWarn = '储值卡当前商户无法使用'
          form.voucherAmount = 0
        } else {
          voucher = data
        }
      })
    }
  }

  /**
   * 初始化数据
   */
  async function init() {
    genOrderNo()
    // 获取商户和应用编码
    form.mchCode = (await findByParamKey('CashierMchCode')).data
    form.mchAppCode = (await findByParamKey('CashierMchAppCode')).data
    // 商户下拉列表
    mchDrop().then(({ data }) => {
      mchList = data
    })
    // 初始化应用下拉列表
    mchAppChange()
    getWallet()
  }
  /**
   * 生成订单号
   */
  function genOrderNo() {
    form.businessId = 'P' + new Date().getTime()
  }

  /**
   * 支付
   */
  function pay() {
    formRef?.validate().then(async () => {
      loading = true
      // 组装支付参数
      const payWayList = [
        { payChannel: form.payChannel, payWay: form.payWay, amount: form.asyncAmount },
        { payChannel: payChannelEnum.CASH, payWay: payWayEnum.NORMAL, amount: form.cashAmount },
        { payChannel: payChannelEnum.WALLET, payWay: payWayEnum.NORMAL, amount: form.walletAmount },
      ]
      // 异步
      const { data } = await combinationPay({
        title: form.title,
        businessId: form.businessId,
        payWayList: payWayList,
        mchCode: form.mchCode,
        mchAppCode: form.mchAppCode,
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
        genOrderNo()
        getWallet()
        createMessage.success('支付成功')
      }
    })
  }

  /**
   * 关闭
   */
  function handleCancel() {
    cashierQrCode.handleClose()
    loading = false
    genOrderNo()
    getWallet()
    pause()
  }
</script>

<style scoped></style>
