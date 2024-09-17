<template>
  <div>
    <a-form
      class="small-from-item w-40vw"
      ref="formRef"
      :model="form"
      :rules="rules"
      :labelCol="{ span: 6 }"
      :wrapperCol="{ span: 18 }"
      :validate-trigger="['blur', 'change']"
    >
      <a-form-item label="商户号" name="mchNo">
        <a-select
          :filter-option="search"
          v-model:value="form.mchNo"
          placeholder="请选择商户"
          :options="mchNoOptions"
          @change="merchantChange"
        />
      </a-form-item>
      <a-form-item label="应用号" name="appId">
        <a-select
          :filter-option="search"
          :options="mchAppOptions"
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
        <a-input v-model:value="form.bizOrderNo" placeholder="请输入订单号" />
      </a-form-item>
      <a-form-item label="支付标题" name="title">
        <a-input v-model:value="form.title" placeholder="请输入支付标题" />
      </a-form-item>
      <a-form-item label="支付描述" name="description">
        <a-input v-model:value="form.description" placeholder="请输入支付描述" />
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
      </a-form-item>
      <a-form-item label="随机数" name="nonceStr">
        <a-input v-model:value="form.nonceStr" placeholder="请输入随机数" />
      </a-form-item>
      <a-form-item label="签名" name="sign">
        <a-input v-model:value="form.sign" placeholder="请输入签名" />
      </a-form-item>

      <a-space style="display: flex; justify-content: center">
        <a-button>重置</a-button>
        <a-button type="primary">提交</a-button>
      </a-space>
    </a-form>
  </div>
</template>
<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from 'vue'
  import { PayParam } from './DevelopTrade.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { merchantDropdown } from '@/views/daxpay/admin/merchant/info/Merchant.api'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { mchAppDropdown } from '@/views/daxpay/common/merchant/app/MchApp.api'
  import { useDict } from '@/hooks/bootx/useDict'

  const { search } = useFormEdit()
  const { dictDropDown } = useDict()
  const form = reactive<PayParam>({})
  const rules = computed(() => {
    return {}
  })

  const mchNoOptions = ref<LabeledValue[]>([])
  const mchAppOptions = ref<LabeledValue[]>([])
  const channelOptions = ref<LabeledValue[]>([])
  const methodOptions = ref<LabeledValue[]>([])

  onMounted(() => {
    initData()
  })

  /**
   * 初始化数据
   */
  async function initData() {
    merchantDropdown().then(({ data }) => {
      mchNoOptions.value = data
    })
    channelOptions.value = await dictDropDown('channel')
    methodOptions.value = await dictDropDown('pay_method')
  }

  /**
   * 商户变动时刷新应用列表
   */
  function merchantChange() {
    form.appId = undefined
    mchAppDropdown(form.mchNo).then(({ data }) => {
      mchAppOptions.value = data
    })
  }
</script>

<style scoped lang="less"></style>
