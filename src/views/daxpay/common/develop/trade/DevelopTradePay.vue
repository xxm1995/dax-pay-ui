<template>
  <div>
    <a-spin :spinning="confirmLoading">
      <a-form
        class="small-from-item w-40vw"
        ref="formRef"
        :model="form"
        :rules="rules"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
        :validate-trigger="['blur', 'change']"
      >
        <a-form-item label="应用号" name="appId">
          <a-select
            :filter-option="search"
            :options="mchAppList"
            v-model:value="form.appId"
            placeholder="请选择商户应用"
          />
        </a-form-item>
        <a-form-item label="支付通道" name="channel">
          <a-select
            allow-clear
            v-model:value="form.channel"
            :options="channelOptions"
            placeholder="请选择支付通道"
          />
        </a-form-item>
        <a-form-item label="订单号" name="bizOrderNo">
          <a-input-group compact>
            <a-input
              v-model:value="form.bizOrderNo"
              placeholder="请输入订单号"
              style="width: calc(100% - 60px)"
            />
            <a-button @click="genBizOrderNo">生成</a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item label="支付标题" name="title">
          <a-input v-model:value="form.title" placeholder="请输入支付标题" />
        </a-form-item>
        <a-form-item label="支付金额" name="amount">
          <a-input-number
            v-model:value="form.amount"
            :min="0.01"
            :precision="2"
            placeholder="请输入支付金额"
          />
        </a-form-item>
        <a-form-item label="支付方式" name="method">
          <a-select
            allow-clear
            v-model:value="form.method"
            :options="methodOptions"
            placeholder="请选择支付方式"
          />
        </a-form-item>
        <a-form-item label="支付描述" name="description">
          <a-input v-model:value="form.description" placeholder="请输入支付描述" />
        </a-form-item>
        <a-form-item label="支付扩展参数" name="extraParam">
          <a-textarea v-model:value="form.extraParam" :rows="3" placeholder="请输入支付扩展参数" />
        </a-form-item>
        <a-form-item label="商户扩展参数" name="attach">
          <a-textarea v-model:value="form.attach" :rows="3" placeholder="请输入商户扩展参数" />
        </a-form-item>
        <a-form-item label="异步通知地址" name="notifyUrl">
          <a-input v-model:value="form.notifyUrl" placeholder="请输入异步通知地址" />
        </a-form-item>
        <a-form-item label="支付超时时间" name="expiredTime">
          <!-- 日期时间 -->
          <a-date-picker
            allowClear
            showTime
            style="width: 100%"
            placeholder="请选择订单过期时间"
            :valueFormat="'YYYY-MM-DD HH:mm:ss'"
            v-model:value="form.expiredTime"
          />
        </a-form-item>
        <a-form-item label="终端IP" name="clientIp">
          <a-input v-model:value="form.clientIp" placeholder="请输入终端IP地址" />
        </a-form-item>
        <a-form-item label="随机数" name="nonceStr">
          <a-input-group compact>
            <a-input
              v-model:value="form.nonceStr"
              style="width: calc(100% - 60px)"
              placeholder="请输入随机数"
            />
            <a-button @click="genNonceStr">生成</a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item label="请求时间" name="reqTime">
          <a-input-group compact>
            <a-input disabled v-model:value="form.reqTime" style="width: calc(100% - 60px)" />
            <a-button @click="updateReqTime">更新</a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item label="签名" name="sign">
          <a-input-group compact>
            <a-input
              placeholder="请输入签名"
              v-model:value="form.sign"
              style="width: calc(100% - 60px)"
            />
            <a-button @click="getSign">生成</a-button>
          </a-input-group>
        </a-form-item>
        <a-space style="display: flex; justify-content: center">
          <a-button @click="handleReset">重置表单</a-button>
          <a-button type="primary" @click="handleSubmit">提交请求</a-button>
        </a-space>
      </a-form>
    </a-spin>
  </div>
</template>
<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { Modal } from 'ant-design-vue'
  import { PayParam, paySign, tradePay } from './DevelopTrade.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { mchAppDropdown } from '@/views/daxpay/common/merchant/app/MchApp.api'
  import { useDict } from '@/hooks/bootx/useDict'
  import XEUtils from 'xe-utils'
  import { buildShortUUID, buildUUID } from '@/utils/uuid'
  import { copyText } from '@/utils/copyTextToClipboard'

  const { search } = useFormEdit()
  const { dictDropDown } = useDict()

  const confirmLoading = ref(false)
  const formRef = ref<FormInstance>()
  const form = reactive<PayParam>({
    title: '测试支付',
    clientIp: '127.0.0.1',
    amount: 0.01,
  })
  const rules = computed(() => {
    return {
      appId: [{ required: true, message: '应用号不可为空' }],
      channel: [{ required: true, message: '支付通道不可为空' }],
      bizOrderNo: [{ required: true, message: '订单号不可为空' }],
      title: [{ required: true, message: '支付标题不可为空' }],
      amount: [{ required: true, message: '支付金额不可为空' }],
      method: [{ required: true, message: '支付方式不可为空' }],
      clientIp: [{ required: true, message: '终端IP不可为空' }],
      nonceStr: [{ required: true, message: '随机数不可为空' }],
      reqTime: [{ required: true, message: '请求时间不可为空' }],
    } as Record<string, Rule[]>
  })

  const mchAppList = ref<LabeledValue[]>([])
  const channelOptions = ref<LabeledValue[]>([])
  const methodOptions = ref<LabeledValue[]>([])

  onMounted(() => {
    initData()
  })

  /**
   * 初始化数据
   */
  async function initData() {
    confirmLoading.value = false
    channelOptions.value = await dictDropDown('channel')
    methodOptions.value = await dictDropDown('pay_method')
    // 时间默认30M后
    form.expiredTime = XEUtils.toDateString(
      new Date(new Date().getTime() + 30 * 60 * 1000),
      'yyyy-MM-dd HH:mm:ss',
    )
    initMchApp()
    genNonceStr()
    genBizOrderNo()
    updateReqTime()
  }

  /**
   * 商户变动时刷新应用列表
   */
  function initMchApp() {
    mchAppDropdown().then(({ data }) => {
      mchAppList.value = data
    })
  }

  /**
   * 生成订单号
   */
  function genBizOrderNo() {
    form.bizOrderNo = buildShortUUID('PAY')
  }

  /**
   * 生成随机数
   */
  function genNonceStr() {
    form.nonceStr = buildUUID()
  }

  /**
   * 更新请求时间
   */
  function updateReqTime() {
    form.reqTime = XEUtils.toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss')
  }
  /**
   * 获取签名
   */
  function getSign() {
    formRef.value?.validate().then(() => {
      paySign(form).then(({ data }) => {
        form.sign = data
      })
    })
  }

  /**
   * 重置
   */
  function handleReset() {
    formRef.value?.resetFields()
    initData()
  }

  /**
   * 提交
   */
  function handleSubmit() {
    formRef.value?.validate().then(() => {
      confirmLoading.value = true
      tradePay(form)
        .then(({ data }) => {
          Modal.info({
            title: '响应结果',
            content: `${JSON.stringify(data)}`,
            okText: '复制payBody',
            onOk() {
              copyText(data.payBody as string)
            },
          })
        })
        .finally(() => {
          confirmLoading.value = false
        })
    })
  }
</script>

<style scoped lang="less"></style>
