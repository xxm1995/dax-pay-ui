<template>
  <div style="background-color: #f5f5f7">
    <!--  云闪付表单方式专用  -->
    <div v-html="payForm"></div>
    <div class="page paydemo">
      <div class="blog-container" id="container">
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
                  <div v-for="item in WxPayList" :key="item.payInfo.method" @click="handleActive(item.payInfo)">
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
                  <div v-for="item in AliPayList" :key="item.payInfo.method" @click="handleActive(item.payInfo)">
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
                <div class="paydemo-type-name">
                  <span> 云闪付支付（沙箱环境） </span>
                  <a target="_blank" href="https://open.unionpay.com/tjweb/support/faq/mchlist?id=4">测试卡信息</a>、
                  <a target="_blank" href="https://open.unionpay.com/tjweb/ij/tool/qrcodeFormPage">条码仿真工具</a>
                </div>
                <div class="paydemo-type-body">
                  <div v-for="item in UniPayList" :key="item.payInfo.method" @click="handleActive(item.payInfo)">
                    <div :class="item.payInfo === currentActive ? 'colorChange' : 'paydemoType'">
                      <img :src="item.img" class="paydemo-type-img" />
                      <span class="color-change">{{ item.title }}</span>
                    </div>
                  </div>
                </div>
                <div class="paydemo-type-name">聚合支付</div>
                <div class="paydemo-type-body">
                  <div v-for="item in aggregationPayList" :key="item.payInfo.method" @click="handleActive(item.payInfo)">
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
                      <a-input v-model:value="bizOrderNo" />
                    </span>
                    <a-button type="primary" @click="genBizOrderNo">生成</a-button>
                  </div>
                  <div class="paydemo-form-item">
                    <label>支付标题：</label>
                    <span>
                      <a-input style="width: 300px" v-model:value="title" />
                    </span>
                  </div>
                  <div class="paydemo-form-item">
                    <label>是否分账：</label>
                    <span>
                      <a-switch checked-children="启用" un-checked-children="停用" v-model:checked="allocation" />
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
                    <affix :offset-bottom="20" class="mr-1">
                      <span v-if="totalMoney" style="color: #fd482c; font-size: 18px; padding-right: 10px">{{ '¥ ' + totalMoney }}</span>
                      <a-button type="primary" :disabled="currentActive.method == null || !totalMoney" @click="pay">立即支付</a-button>
                    </affix>
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
  import { aggregateBarCodePay, createAggregatePayUrl, findStatusByBizOrderNoeNo, getUniCashierUrl, simplePayCashier } from './Cashier.api'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from 'vue/macros'
  import { nextTick, onMounted, onUnmounted } from 'vue'
  import QrCode from '/@/components/Qrcode/src/Qrcode.vue'
  import { useIntervalFn } from '@vueuse/core'
  import { payChannelEnum } from '/@/enums/payment/payChannelEnum'
  import { payMethodEnum } from '/src/enums/payment/payMethodEnum'
  import { Affix } from 'ant-design-vue'

  const { createMessage } = useMessage()

  const cashierQrCode = $ref<any>()
  const cashierBarCode = $ref<any>()

  let payForm = $ref<string>()

  // 业务单号
  let bizOrderNo = $ref<string>('')
  let title = $ref<string>('测试支付')
  let allocation = $ref<boolean>(false)
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
    channel: null,
    method: null,
  })
  let AliPayList = $ref([
    {
      img: new URL('./imgs/ali/ali_qr.svg', import.meta.url).href,
      title: '扫码支付',
      payInfo: { channel: payChannelEnum.ALI, method: payMethodEnum.QRCODE },
    },
    {
      img: new URL('./imgs/ali/ali_bar.svg', import.meta.url).href,
      title: '条码支付',
      payInfo: { channel: payChannelEnum.ALI, method: payMethodEnum.BARCODE },
    },
    {
      img: new URL('./imgs/ali/ali_pc.svg', import.meta.url).href,
      title: 'PC支付',
      payInfo: { channel: payChannelEnum.ALI, method: payMethodEnum.WEB },
    },
    {
      img: new URL('./imgs/ali/ali_wap.svg', import.meta.url).href,
      title: 'wap支付',
      payInfo: { channel: payChannelEnum.ALI, method: payMethodEnum.WAP },
    },
  ])
  let WxPayList = $ref([
    {
      img: new URL('./imgs/wechat/wx_native.svg', import.meta.url),
      title: '扫码支付',
      payInfo: { channel: payChannelEnum.WECHAT, method: payMethodEnum.QRCODE },
    },
    {
      img: new URL('./imgs/wechat/wx_bar.svg', import.meta.url),
      title: '条码支付',
      payInfo: { channel: payChannelEnum.WECHAT, method: payMethodEnum.BARCODE },
    },
    {
      img: new URL('./imgs/wechat/wx_h5.svg', import.meta.url).href,
      title: 'wap支付',
      payInfo: { channel: payChannelEnum.WECHAT, method: payMethodEnum.WAP },
    },
  ])
  // 云闪付
  let UniPayList = $ref([
    {
      img: new URL('./imgs/wechat/wx_native.svg', import.meta.url),
      title: '扫码支付',
      payInfo: { channel: payChannelEnum.UNION_PAY, method: payMethodEnum.QRCODE },
    },
    {
      img: new URL('./imgs/wechat/wx_bar.svg', import.meta.url),
      title: '条码支付',
      payInfo: { channel: payChannelEnum.UNION_PAY, method: payMethodEnum.BARCODE },
    },
    {
      img: new URL('./imgs/wechat/wx_h5.svg', import.meta.url).href,
      title: 'wap支付',
      payInfo: { channel: payChannelEnum.UNION_PAY, method: payMethodEnum.WAP },
    },
    {
      img: new URL('./imgs/ali/ali_pc.svg', import.meta.url).href,
      title: 'web支付',
      payInfo: { channel: payChannelEnum.UNION_PAY, method: payMethodEnum.WEB },
    },
  ])
  let aggregationPayList = $ref([
    {
      img: new URL('./imgs/aggregate/qr_cashier.svg', import.meta.url).href,
      title: '扫码支付',
      payInfo: { channel: payChannelEnum.AGGREGATION, method: payMethodEnum.QRCODE },
    },
    {
      img: new URL('./imgs/aggregate/auto_bar.svg', import.meta.url).href,
      title: '条码支付',
      payInfo: { channel: payChannelEnum.AGGREGATION, method: payMethodEnum.BARCODE },
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
      findStatusByBizOrderNoeNo(bizOrderNo)
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
    genBizOrderNo()
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
    const { channel, method } = currentActive
    // 聚合支付
    if (channel === payChannelEnum.AGGREGATION) {
      if (method === payMethodEnum.BARCODE) {
        cashierBarCode.init('请输入支付宝、微信或云闪付条码')
      } else {
        aggregationQr()
      }
      return
    }

    // 普通支付
    if (method === payMethodEnum.BARCODE) {
      let msg: string
      if (channel === payChannelEnum.ALI) {
        msg = '请输入支付宝条码'
      } else if (channel === payChannelEnum.WECHAT) {
        msg = '请输入微信条码'
      } else {
        msg = '请输入云闪付条码，使用二维码仿真工具获取'
      }
      cashierBarCode.init(msg)
    } else {
      qrPay(channel, method)
    }
  }

  /**
   * 聚合扫码
   */
  async function aggregationQr() {
    const param = {
      bizOrderNo,
      allocation,
      amount: totalMoney,
      title: title,
    }
    // 获取聚合支付中间页地址
    const { data: qrUrl } = await createAggregatePayUrl(param)
    resume()
    cashierQrCode.init(qrUrl, '请使用支付宝、微信扫码支付')
  }

  /**
   * 条码支付, 处理普通支付和聚合支付
   */
  function barPay(authCode: string) {
    const { channel, method } = currentActive
    // 聚合支付走单独分支
    if (channel === payChannelEnum.AGGREGATION) {
      aggregationBarPay(authCode)
      return
    }
    // 普通条码支付
    const param = {
      title: title,
      bizOrderNo,
      allocation,
      amount: totalMoney,
      channel: channel,
      method,
      authCode,
    }
    simplePayCashier(param).then(() => {
      resume()
    })
  }

  /**
   * 扫码支付
   */
  async function qrPay(channel, method) {
    const param = {
      title,
      bizOrderNo,
      allocation,
      channel,
      amount: totalMoney,
      method,
    }
    loading = true
    const { data } = await simplePayCashier(param).finally(() => {
      loading = false
    })
    // 云闪付wap和web支付
    if ([payMethodEnum.WAP, payMethodEnum.WEB].includes(method) && channel === payChannelEnum.UNION_PAY) {
      payForm = data.payBody
      // 本地提交提交支付表单
      nextTick(() => {
        console.log(document.forms[0])
        document.forms[0].submit()
      })
    }
    // pc支付(微信/支付宝)
    else if ([payMethodEnum.WAP, payMethodEnum.WEB].includes(method)) {
      window.open(data.payBody)
    } else if (channel === payChannelEnum.ALI) {
      cashierQrCode.init(data.payBody, '请使用支付宝"扫一扫"进行支付')
      resume()
    } else if (channel === payChannelEnum.WECHAT) {
      cashierQrCode.init(data.payBody, '请使用微信"扫一扫"进行支付')
      resume()
    } else {
      cashierQrCode.init(data.payBody, '请解析二维码后使用二维码仿真工具进行支付')
      resume()
    }
  }
  /**
   * 条码支付
   */
  function aggregationBarPay(authCode: string) {
    const param = {
      title,
      amount: totalMoney,
      bizOrderNo,
      authCode,
    }
    aggregateBarCodePay(param).then(() => {
      resume()
    })
  }
  /**
   * 生成业务号
   */
  function genBizOrderNo() {
    bizOrderNo = 'P' + new Date().getTime()
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
    genBizOrderNo()
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
