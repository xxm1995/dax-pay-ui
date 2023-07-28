<template>
  <a-card :bordered="false">
    <a-spin :spinning="loading">
      <a-form ref="formRef" :model="form" :rules="rules" v-bind="formItemLayout">
        <a-form-item label="商户号" name="mchCode">
          <a-select
            style="width: 60%"
            allow-clear
            :options="mchList"
            v-model:value="form.mchCode"
            placeholder="请选择商户"
            @change="mchAppChange"
          />
        </a-form-item>
        <a-form-item label="应用号" name="mchAppCode" v-show="form.mchCode">
          <a-select style="width: 60%" allow-clear :options="mchAppList" v-model:value="form.mchAppCode" placeholder="请选择商户应用" />
        </a-form-item>
        <a-form-item label="订单编号" name="businessId">
          <a-input style="width: 60%" v-model:value="form.businessId" placeholder="请输入订单编号">
            <template #addonAfter>
              <a-button type="link" size="small" @click="genOrderNo"> 生成订单号 </a-button>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="订单名称" name="title">
          <a-input style="width: 60%" v-model:value="form.title" placeholder="请输入金额" />
        </a-form-item>
        <a-form-item label="金额" name="amount">
          <a-input-number style="width: 60% !important" :precision="2" :min="0.01" v-model:value="form.amount" placeholder="请输入金额" />
        </a-form-item>
        <a-form-item
          v-for="(o, i) in form.vouchers"
          :key="o.key"
          v-bind="formItemLayout"
          :label="'储值卡 ' + (i + 1)"
          :name="['vouchers', i, 'value']"
          :rules="{ required: true, message: '储值卡号必填' }"
        >
          <a-input v-model:value="o.value" style="width: 60%; margin-right: 8px" placeholder="请填入储值卡号" @blur="getVoucher(o)" />
          <template #help>
            <span v-if="o.voucher">储值卡面值：{{ o.voucher.faceValue }} 余额：{{ o.voucher.balance }}</span>
            <span v-else></span>
          </template>
          <MinusCircleOutlined
            v-if="form.vouchers.length > 1"
            class="dynamic-delete-button"
            :disabled="form.vouchers.length === 1"
            @click="removeVoucher(o)"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayoutWithOutLabel">
          <a-button type="dashed" style="width: 60%" @click="addVoucher">
            <PlusOutlined />
            添加新储值卡
          </a-button>
        </a-form-item>
      </a-form>
      <div style="display: flex; justify-content: center">
        <a-button type="primary" @click="pay"> 发起支付 </a-button>
      </div>
    </a-spin>
  </a-card>
</template>
<script setup lang="ts">
  import { $ref } from 'vue/macros'
  import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
  import { onMounted, reactive } from 'vue'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { getAndJudgeVoucher, Voucher } from '/@/views/modules/payment/channel/voucher/list/Voucher.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { payChannelEnum } from '/@/enums/payment/payChannelEnum'
  import { payWayEnum } from '/@/enums/payment/payWayEnum'
  import { findByParamKey } from '/@/api/common/Parameter'
  import { dropdown as mchDrop } from '/@/views/modules/payment/merchant/MerchantInfo.api'
  import { dropdown as mchAppDrop } from '/@/views/modules/payment/app/MchApplication.api'
  import { singlePay } from '/@/views/demo/payment/cashier/Cashier.api'
  import { useMessage } from '/@/hooks/web/useMessage'

  const { createMessage } = useMessage()

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  }

  /**
   * 动态表单项
   */
  interface Item {
    value: string
    key: number
    voucher?: Voucher
    voucherMsg?: string
  }
  const rules = {
    mchCode: [{ required: true, message: '请选择商户' }],
    mchAppCode: [{ required: true, message: '请选择商户对应的应用' }],
    businessId: [{ required: true, message: '业务不可为空' }],
    title: [{ required: true, message: '标题不可为空' }],
    amount: [{ required: true, message: '金额不可为空' }],
  }

  let loading = $ref(false)
  const formRef = $ref<FormInstance>()
  // 商户和应用下拉列表
  let mchList = $ref<LabeledValue[]>()
  let mchAppList = $ref<LabeledValue[]>()

  const form = reactive({
    payChannel: payChannelEnum.VOUCHER,
    payWay: payWayEnum.NORMAL,
    title: '测试多卡支付订单',
    businessId: '',
    amount: 0.01,
    mchCode: '',
    mchAppCode: '',
    // 储值卡
    vouchers: [
      {
        value: '',
        key: Date.now(),
      },
    ],
  })

  /**
   * 页面加载钩子
   */
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
    // 商户下拉列表
    mchDrop().then(({ data }) => {
      mchList = data
    })
    // 初始化应用下拉列表
    mchAppChange()
  }

  /**
   * 生成订单号
   */
  function genOrderNo() {
    form.businessId = 'P' + new Date().getTime()
  }

  /**
   * 商户应用下拉列表
   */
  function mchAppChange() {
    mchAppDrop(form.mchCode).then(({ data }) => {
      mchAppList = data
    })
  }

  /**
   * 添加表单项
   */
  function addVoucher() {
    form.vouchers.push({
      value: '',
      key: Date.now(),
    })
  }

  /**
   * 减少表单项
   */
  function removeVoucher(item: Item) {
    let index = form.vouchers.indexOf(item)
    if (index !== -1) {
      form.vouchers.splice(index, 1)
    }
  }

  /**
   * 支付
   */
  function pay() {
    formRef?.validate().then(async () => {
      loading = true
      const voucherNoList = form.vouchers.map((o) => o.value)
      const vForm = {
        payChannel: payChannelEnum.VOUCHER,
        payWay: payWayEnum.NORMAL,
        mchCode: form.mchCode,
        mchAppCode: form.mchAppCode,
        businessId: form.businessId,
        title: form.title,
        amount: form.amount,
        voucherNoList: voucherNoList,
      }
      await singlePay(vForm).finally(() => (loading = false))
      createMessage.success('支付成功')
      genOrderNo()
      loading = false
    })
  }
  /**
   * 获取储值卡信息
   */
  function getVoucher(item: Item) {
    console.log(item)
    getAndJudgeVoucher({ cardNo: item.value }).then(({ data }) => {
      // 储值卡是否属于当前商户
      if (data.mchCode !== form.mchCode || data.mchAppCode !== form.mchAppCode) {
        item.voucher = null as any
        createMessage.warn('储值卡当前商户无法使用')
      } else {
        item.voucher = data
      }
    })
  }
</script>

<style scoped lang="less"></style>
