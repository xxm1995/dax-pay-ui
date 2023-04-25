<template>
  <div style="background-color: #f5f5f7">
    <div class="page paydemo">
      <div class="blog-container" id="container" style="margin-top: 80px">
        <a-spin :spinning="loading">
          <div class="content" style="padding-top: 30px">
            <div style="width: 100%">
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
                    <div
                      class="paydemo-type-h5"
                      code="WECHAT_H5"
                      @click="handleActive('WECHAT_H5')"
                      @mouseover="wxHover = true"
                      @mouseleave="wxHover = false"
                    >
                      <img src="./imgs/wechat/wx_h5.svg" class="paydemo-type-img" />
                      <span>微信H5</span>
                    </div>
                    <div class="paydemo-type-h5 layui-hide codeImg_wx_h5" v-if="wxHover">
                      <qr-code :options="{ margin: 2 }" :width="150" :value="wxH5Url" />
                      <span>请使用手机浏览器扫码</span>
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
                    <div class="paydemo-type-h5" code="ALI_WAP" @mouseover="aliHover = true" @mouseleave="aliHover = false">
                      <img src="./imgs/ali/ali_wap.svg" class="paydemo-type-img" />
                      <span>支付宝WAP</span>
                    </div>
                    <div class="paydemo-type-h5 layui-hide codeImg_wx_h5" v-if="aliHover">
                      <qr-code :options="{ margin: 2 }" :width="150" :value="aliH5Url" />
                      <span>请使用手机浏览器扫码</span>
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
                </div>
              </div>
              <div class="paydemo-type-content">
                <div class="paydemo-type-name">支付信息</div>
                <a-form class="layui-form">
                  <div class="paydemo-form-item">
                    <label>业务单号：</label>
                    <span>
                      <a-input v-model:value="businessId" />
                    </span>
                    <span id="randomOrderNo" class="layui-btn layui-btn-xs paydemo-btn" @click="refreshBusinessId">刷新订单号</span>
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
                  </div>
                  <div style="margin-top: 20px; text-align: right">
                    <span style="color: #fd482c; font-size: 18px; padding-right: 10px">{{ '¥ ' + totalMoney }}</span>
                    <a-button type="primary" :disabled="currentActive.payWay == null" @click="pay">立即支付</a-button>
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
  import { createAggregatePay, findStatusByBusinessId, singlePay } from './Cashier.api'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { onMounted, onUnmounted } from 'vue'
  import QrCode from '/@/components/Qrcode/src/Qrcode.vue'
  import { useIntervalFn } from '@vueuse/core'
  import { findByParamKey } from '/@/api/common/Parameter'

  const { createMessage } = useMessage()

  const cashierQrCode = $ref<any>()
  const cashierBarCode = $ref<any>()

  // 业务单号
  let businessId = $ref('')
  let title = $ref('测试支付')
  let loading = $ref(false)
  let wxH5Url = $ref('cs')
  // 微信 hover 状态
  let wxHover = $ref(false)
  let aliH5Url = $ref('cs')
  // 支付宝 hover 状态
  let aliHover = $ref(false)
  let currentActive = $ref({
    // 当前选择支付渠道和方式
    payChannel: null,
    payWay: null,
  })
  let AliPayList = $ref([
    { img: new URL('./imgs/ali/ali_qr.svg', import.meta.url).href, title: '支付宝二维码', payInfo: { payChannel: 1, payWay: 4 } },
    { img: new URL('./imgs/ali/ali_bar.svg', import.meta.url).href, title: '支付宝条码', payInfo: { payChannel: 1, payWay: 5 } },
    { img: new URL('./imgs/ali/ali_pc.svg', import.meta.url).href, title: '支付宝PC网站', payInfo: { payChannel: 1, payWay: 3 } },
    { img: new URL('./imgs/ali/ali_wap.svg', import.meta.url).href, title: '支付宝wap支付', payInfo: { payChannel: 1, payWay: 1 } },
  ])
  let WxPayList = $ref([
    { img: new URL('./imgs/wechat/wx_native.svg', import.meta.url), title: '微信二维码', payInfo: { payChannel: 2, payWay: 4 } },
    { img: new URL('./imgs/wechat/wx_bar.svg', import.meta.url), title: '微信条码', payInfo: { payChannel: 2, payWay: 5 } },
    // { img: new URL('./imgs/wechat/wx_jsapi.svg', import.meta.url), title: '公众号/小程序', payInfo: { payChannel: 2, payWay: 23 } }
  ])
  let aggregationPayList = $ref([
    {
      img: new URL('./imgs/qr/qr_cashier.svg', import.meta.url).href,
      title: '聚合扫码(用户扫商家)',
      payInfo: { payChannel: 99, payWay: 4 },
    },
    { img: new URL('./imgs/qr/auto_bar.svg', import.meta.url).href, title: '聚合条码(商家扫用户)', payInfo: { payChannel: 99, payWay: 5 } },
  ])
  let payMoneyList = [
    // 支付金额列表
    { label: '0.01', value: 0.01 },
    { label: '1.01', value: 1.01 },
    { label: '9.99', value: 9.99 },
    { label: '99.99', value: 99.99 },
    { label: '2500', value: 2500 },
  ]
  let payMoneyValue = $ref(0.01)
  let totalMoney: null | number = $ref(0.01)
  let payMoneyShow = false

  // 检查支付状态
  const { pause, resume } = useIntervalFn(
    () => {
      findStatusByBusinessId(businessId).then((res) => {
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

  // 支付金额变动
  function payMoneyValueChange(e) {
    totalMoney = null
    if (e.target.value === '6') {
      payMoneyShow = true
    } else {
      totalMoney = e.target.value
      payMoneyShow = false
    }
  }
  // 发起支付
  function pay() {
    const { payChannel, payWay } = currentActive
    // 聚合扫码
    if (payChannel === 99 && payWay === 4) {
      aggregationQr()
    } else if (payChannel === 99 && payWay === 5) {
      // 聚合条码
      cashierBarCode.init('请输入支付宝、微信条码')
    } else {
      // 普通支付
      // 付款码
      if (payWay === 5) {
        cashierBarCode.init(payChannel === 1 ? '请输入支付宝条码' : '请输入微信条码')
      } else {
        qrPay(payChannel, payWay)
      }
    }
  }
  // 扫码支付
  async function qrPay(payChannel, payWay) {
    const param = {
      businessId: businessId,
      amount: totalMoney,
      title: title,
      payChannel,
      payWay,
    }
    // 接受结果
    loading = true
    const { data } = await singlePay(param).catch(() => (loading = false))
    loading = false
    // pc支付
    if ([1, 3].includes(payWay)) {
      window.open(data.asyncPayInfo.payBody)
    } else if (payChannel === 1) {
      cashierQrCode.init(data.asyncPayInfo.payBody, '请使用支付宝"扫一扫"扫码支付')
      resume()
    } else {
      cashierQrCode.init(data.asyncPayInfo.payBody, '请使用微信"扫一扫"扫码支付')
      resume()
    }
  }
  // 聚合扫码
  async function aggregationQr() {
    const param = {
      businessId: businessId,
      amount: totalMoney,
      title: title,
    }
    // 获取聚合支付的地址
    const { data: cashierAggregateUrl } = await findByParamKey('CashierAggregateUrl')
    // 获取聚合支付的标识key
    const { data: qrKey } = await createAggregatePay(param)
    // 发起支付
    const qrUrl = `${cashierAggregateUrl}/cashier/aggregatePay?key=${qrKey}`
    cashierQrCode.init(qrUrl, '请使用支付宝或微信"扫一扫"扫码支付')
    resume()
  }
  // 条码支付
  function barPay(authCode) {
    const { payChannel, payWay } = currentActive
    const param = {
      businessId: businessId,
      amount: totalMoney,
      title: title,
      authCode,
      payChannel,
      payWay,
    }
    singlePay(param).then(() => {
      resume()
    })
  }
  // 生成业务id
  function refreshBusinessId() {
    businessId = 'P' + new Date().getTime()
  }
  // 当前选择的支付类型
  function handleActive(payInfo) {
    console.log(payInfo)
    currentActive = payInfo
  }
  // 关闭
  function handleCancel() {
    cashierQrCode.handleClose()
    cashierBarCode.handleClose()
    refreshBusinessId()
    pause()
  }

  onMounted(() => {
    refreshBusinessId()
  })
  onUnmounted(() => {
    handleCancel()
  })
</script>

<style scoped lang="less">
  @import 'style.less';
</style>
