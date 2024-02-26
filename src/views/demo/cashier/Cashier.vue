<template>
  <div style="background-color: #f5f5f7">
    <div class="page paydemo">
      <div class="blog-container" id="container" style="margin-top: 80px">
        <a-spin :spinning="loading">
          <div class="content" style="padding-top: 20px">
            <div style="width: 100%">
              <a-alert
                message="本收银台是基于DaxPay开源支付网关搭建的演示模块，支付后可以通过管理端进行退款。"
                type="warning"
                show-icon
                style="margin-bottom: 20px; padding: 15px"
              />
              <div class="paydemo-type-content">
                <div class="paydemo-type-name">微信支付</div>
                <div class="paydemo-type-body">
                  <div v-for="item in WxPayList" :key="item.payInfo.payWay" @click="handleActive(item.payInfo)">
                    <div :class="item.payInfo === currentActive ? 'colorChange' : 'paydemoType'">
                      <img :src="item.img" class="paydemo-type-img" />
                      <span class="color-change">{{ item.title }}</span>
                    </div>
                  </div>
                  <div style="position: relative">
                    <div class="paydemo-type-h5" @mouseover="wxHover = true" @mouseleave="wxHover = false">
                      <img src="./imgs/wechat/wx_jsapi.svg" class="paydemo-type-img" />
                      <span class="color-change">公众号</span>
                    </div>
                    <div class="paydemo-type-h5 codeImg_wx_h5" v-if="wxHover">
                      <qr-code :options="{ margin: 2 }" :width="150" :value="wxH5Url" />
                      <span>使用微信扫码体验</span>
                    </div>
                  </div>
                </div>
                <div class="paydemo-type-name">支付宝支付</div>
                <div class="paydemo-type-body">
                  <div v-for="item in AliPayList" :key="item.payInfo.payWay" @click="handleActive(item.payInfo)">
                    <div :class="item.payInfo === currentActive ? 'colorChange' : 'paydemoType'">
                      <img :src="item.img" class="paydemo-type-img" />
                      <span class="color-change">{{ item.title }}</span>
                    </div>
                  </div>
                  <div style="position: relative">
                    <div class="paydemo-type-h5" @mouseover="aliHover = true" @mouseleave="aliHover = false">
                      <img src="./imgs/ali/ali_jsapi.svg" class="paydemo-type-img" />
                      <span>h5支付</span>
                    </div>
                    <div class="paydemo-type-h5 codeImg_wx_h5" v-if="aliHover">
                      <qr-code :options="{ margin: 2 }" :width="150" :value="aliH5Url" />
                      <span>使用支付宝扫码体验</span>
                    </div>
                  </div>
                </div>
                <div class="paydemo-type-name">聚合支付</div>
                <div class="paydemo-type-body">
                  <div v-for="item in aggregationPayList" :key="item.payInfo.payWay" @click="handleActive(item.payInfo)">
                    <div :class="item.payInfo === currentActive ? 'colorChange' : 'paydemoType'">
                      <img :src="item.img" class="paydemo-type-img" />
                      <span class="color-change">{{ item.title }}</span>
                    </div>
                  </div>
                  <div class="paydemo-type-h5" @click="h5cashier">
                    <img src="./imgs/aggregate/cashier-h5.svg" class="paydemo-type-img" style="margin-left: 8px" />
                    <span>H5收银台</span>
                  </div>
                </div>
              </div>
              <div class="paydemo-type-content">
                <div class="paydemo-type-name">支付信息</div>
                <a-form>
                  <div class="paydemo-form-item">
                    <label>业务单号：</label>
                    <span>
                      <a-input v-model:value="businessNo" />
                    </span>
                    <a-button type="primary" @click="genBusinessNo">生成</a-button>
                  </div>
                  <div class="paydemo-form-item">
                    <label>支付标题：</label>
                    <span>
                      <a-input style="width: 300px" v-model:value="title" />
                    </span>
                  </div>
                  <div class="paydemo-form-item">
                    <label>支付金额(元)：</label>
                    <a-radio-group v-model:value="payMoneyValue" @change="payMoneyValueChange">
                      <a-radio :value="item.value" v-for="(item, index) in payMoneyList" :key="index">
                        {{ item.label }}
                      </a-radio>
                    </a-radio-group>
                    <a-input-number
                      v-if="payMoneyShow"
                      style="width: 120px !important"
                      :max="100"
                      :min="0.01"
                      :precision="2"
                      v-model:value="totalMoney"
                    />
                  </div>

                  <div style="margin-top: 20px; text-align: right">
                    <span v-if="totalMoney" style="color: #fd482c; font-size: 18px; padding-right: 10px">{{ '¥ ' + totalMoney }}</span>
                    <a-button type="primary" :disabled="currentActive.payWay == null || !totalMoney" @click="pay">立即支付</a-button>
                  </div>
                </a-form>
              </div>
            </div>
          </div>
        </a-spin>
      </div>
      <!--  扫码弹出窗口  -->
      <cashier-qr-code ref="cashierQrCode" @cancel="handleCancel" />
      <!--  条码支付弹框-->
      <cashier-bar-code ref="cashierBarCode" @cancel="handleCancel" @ok="barPay" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import CashierQrCode from './CashierQrCode.vue'
  import CashierBarCode from './CashierBarCode.vue'
  import { aggregateBarCodePay, createAggregatePayUrl, findStatusByBusinessId, getUniCashierUrl, simplePayCashier } from './Cashier.api'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from 'vue/macros'
  import { onMounted, onUnmounted } from 'vue'
  import QrCode from '/@/components/Qrcode/src/Qrcode.vue'
  import { useIntervalFn } from '@vueuse/core'
  import { payChannelEnum } from '/@/enums/payment/payChannelEnum'
  import { payWayEnum } from '/@/enums/payment/payWayEnum'

  const { createMessage } = useMessage()

  const cashierQrCode = $ref<any>()
  const cashierBarCode = $ref<any>()

  // 业务单号
  let businessNo = $ref<string>('')
  let title = $ref<string>('测试支付')
  let loading = $ref(false)
  // 微信 h5
  let wxH5Url = $ref<string>('初始化中...')
  let wxHover = $ref<boolean>(false)
  // 支付宝 h5
  let aliH5Url = $ref<string>('初始化中...')
  let aliHover = $ref<boolean>(false)
  // 聚合支付
  let h5cashierUrl = $ref<string>('初始化中...')
  // 当前选择支付渠道和方式
  let currentActive = $ref({
    payChannel: null,
    payWay: null,
  })
  let AliPayList = $ref([
    {
      img: new URL('./imgs/ali/ali_qr.svg', import.meta.url).href,
      title: '扫码支付',
      payInfo: { payChannel: payChannelEnum.ALI, payWay: payWayEnum.QRCODE },
    },
    {
      img: new URL('./imgs/ali/ali_bar.svg', import.meta.url).href,
      title: '条码支付',
      payInfo: { payChannel: payChannelEnum.ALI, payWay: payWayEnum.BARCODE },
    },
    {
      img: new URL('./imgs/ali/ali_pc.svg', import.meta.url).href,
      title: 'PC支付',
      payInfo: { payChannel: payChannelEnum.ALI, payWay: payWayEnum.WEB },
    },
    {
      img: new URL('./imgs/ali/ali_wap.svg', import.meta.url).href,
      title: 'wap支付',
      payInfo: { payChannel: payChannelEnum.ALI, payWay: payWayEnum.WAP },
    },
  ])
  let WxPayList = $ref([
    {
      img: new URL('./imgs/wechat/wx_native.svg', import.meta.url),
      title: '扫码支付',
      payInfo: { payChannel: payChannelEnum.WECHAT, payWay: payWayEnum.QRCODE },
    },
    {
      img: new URL('./imgs/wechat/wx_bar.svg', import.meta.url),
      title: '条码支付',
      payInfo: { payChannel: payChannelEnum.WECHAT, payWay: payWayEnum.BARCODE },
    },
    {
      img: new URL('./imgs/wechat/wx_h5.svg', import.meta.url).href,
      title: 'wap支付',
      payInfo: { payChannel: payChannelEnum.WECHAT, payWay: payWayEnum.WAP },
    },
  ])
  let aggregationPayList = $ref([
    {
      img: new URL('./imgs/aggregate/qr_cashier.svg', import.meta.url).href,
      title: '扫码支付',
      payInfo: { payChannel: payChannelEnum.AGGREGATION, payWay: payWayEnum.QRCODE },
    },
    {
      img: new URL('./imgs/aggregate/auto_bar.svg', import.meta.url).href,
      title: '条码支付',
      payInfo: { payChannel: payChannelEnum.AGGREGATION, payWay: payWayEnum.BARCODE },
    },
  ])
  // 结算台下部分内容
  let payMoneyList = [
    // 支付金额列表
    { label: '0.01', value: 0.01 },
    { label: '0.02', value: 0.02 },
    { label: '0.03', value: 0.03 },
    { label: '0.1', value: 0.1 },
    { label: '1.00', value: 1.0 },
    { label: '自定义', value: null },
  ]
  let payMoneyValue = $ref(0.01)
  let totalMoney: null | number = $ref(0.01)
  let payMoneyShow = false

  // 检查支付状态
  const { pause, resume } = useIntervalFn(
    () => {
      findStatusByBusinessId(businessNo)
        .then((res) => {
          // 成功
          if (res.data) {
            createMessage.success('支付成功')
            handleCancel()
          }
        })
        .catch((err) => {
          // 失败
          handleCancel()
        })
    },
    1000 * 3,
    { immediate: false },
  )

  /**
   * 初始化业务数据
   */
  function initData() {
    // 生成业务编码
    genBusinessNo()
    // 获取微信H5、支付宝H5、手机收银台的链接地址
    initH5CashierUrl()
  }
  /**
   * 支付金额变动
   */
  function payMoneyValueChange(e) {
    totalMoney = null
    if (e.target.value === null) {
      payMoneyShow = true
    } else {
      totalMoney = e.target.value
      payMoneyShow = false
    }
  }

  /**
   * h5收银台
   */
  function h5cashier() {
    cashierQrCode.init(h5cashierUrl, '请使用浏览器、支付宝、微信等软件扫码体验')
  }

  /**
   * 发起支付. 分别处理普通支付和聚合支付
   */
  function pay() {
    const { payChannel, payWay } = currentActive
    // 聚合支付
    if (payChannel === payChannelEnum.AGGREGATION) {
      if (payWay === payWayEnum.BARCODE) {
        cashierBarCode.init('请输入支付宝条码或微信条码')
      } else {
        aggregationQr()
      }
      return
    }

    // 普通支付
    if (payWay === payWayEnum.BARCODE) {
      cashierBarCode.init(payChannel === payChannelEnum.ALI ? '请输入支付宝条码' : '请输入微信条码')
    } else {
      qrPay(payChannel, payWay)
    }
  }

  /**
   * 聚合扫码
   */
  async function aggregationQr() {
    const param = {
      businessNo,
      amount: totalMoney,
      title: title,
    }
    // 获取聚合支付中间页地址
    const { data: qrUrl } = await createAggregatePayUrl(param)
    resume()
    cashierQrCode.init(qrUrl, '请使用支付宝或微信"扫一扫"进行支付')
  }

  /**
   * 条码支付, 处理普通支付和聚合支付
   */
  function barPay(authCode: string) {
    const { payChannel, payWay } = currentActive
    // 聚合支付走单独分支
    if (payChannel === payChannelEnum.AGGREGATION) {
      aggregationBarPay(authCode)
      return
    }
    // 普通条码支付
    const param = {
      title: title,
      businessNo,
      amount: totalMoney,
      channel: payChannel,
      payWay,
      authCode,
    }
    simplePayCashier(param).then(() => {
      resume()
    })
  }

  /**
   * 扫码支付
   */
  async function qrPay(payChannel, payWay) {
    const param = {
      title: title,
      businessNo: businessNo,
      amount: totalMoney,
      channel: payChannel,
      payWay,
    }
    loading = true
    const { data } = await simplePayCashier(param).finally(() => {
      loading = false
    })
    // pc支付
    if ([payWayEnum.WAP, payWayEnum.WEB].includes(payWay)) {
      window.open(data.payBody)
    } else if (payChannel === payChannelEnum.ALI) {
      cashierQrCode.init(data.payBody, '请使用支付宝"扫一扫"进行支付')
      resume()
    } else {
      cashierQrCode.init(data.payBody, '请使用微信"扫一扫"进行支付')
      resume()
    }
  }
  /**
   * 条码支付
   */
  function aggregationBarPay(authCode: string) {
    const param = {
      title: title,
      amount: totalMoney,
      businessNo,
      authCode,
    }
    aggregateBarCodePay(param).then(() => {
      resume()
    })
  }
  /**
   * 生成业务号
   */
  function genBusinessNo() {
    businessNo = 'P' + new Date().getTime()
  }

  /**
   * 初始化H5收银台链接
   */
  function initH5CashierUrl() {
    getUniCashierUrl().then((res) => {
      h5cashierUrl = res.data
      wxH5Url = res.data
      aliH5Url = res.data
    })
  }

  /**
   * 当前选择的支付类型
   */
  function handleActive(payInfo) {
    currentActive = payInfo
  }
  /**
   * 关闭
   */
  function handleCancel() {
    cashierQrCode.handleClose()
    cashierBarCode.handleClose()
    genBusinessNo()
    pause()
  }

  /**
   * 入口
   */
  onMounted(() => {
    initData()
  })
  /**
   * 出口
   */
  onUnmounted(() => {
    handleCancel()
  })
</script>

<style scoped lang="less">
  @import 'style.less';
</style>
