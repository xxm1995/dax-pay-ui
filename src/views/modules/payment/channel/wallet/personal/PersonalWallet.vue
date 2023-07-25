<template>
  <a-card :bordered="false">
    <a-spin :spinning="loading">
      <div>
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="商户号" name="mchCode">
            <a-select allow-clear :options="mchList" v-model:value="form.mchCode" placeholder="请选择商户" @change="mchAppChange" />
          </a-form-item>
          <a-form-item label="应用号" name="mchAppCode" v-show="form.mchCode">
            <a-select allow-clear :options="mchAppList" v-model:value="form.mchAppCode" placeholder="请选择商户应用" @change="getWallet" />
          </a-form-item>
          <template v-if="wallet">
            <a-form-item label="状态">
              {{ dictConvert('WalletStatus', wallet.status) }}
            </a-form-item>
            <a-form-item label="余额">
              {{ wallet.balance }}
            </a-form-item>
            <a-form-item>
              <template #label>
                <basic-title helpMessage="当前进行支付中, 且支付未完成冻结的金额">预冻结额度</basic-title>
              </template>
              {{ wallet.freezeBalance }}
            </a-form-item>
          </template>
          <template v-if="form.mchAppCode && !wallet">
            <a-form-item label="开通">
              <a-button type="primary" @click="createMyWallet">点此开通钱包</a-button>
            </a-form-item>
          </template>
        </a-form>
      </div>
    </a-spin>
  </a-card>
</template>
<script setup lang="ts">
  import { $ref } from 'vue/macros'
  import { createWallet, findByUser, Wallet } from '../Wallet.api'
  import { useMessage } from '/@/hooks/web/useMessage'
  import BasicTitle from '/@/components/Basic/src/BasicTitle.vue'
  import { onMounted } from 'vue'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { dropdown as mchAppDrop } from '/@/views/modules/payment/app/MchApplication.api'
  import { dropdown as mchDrop } from '/@/views/modules/payment/merchant/MerchantInfo.api'

  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  const labelCol = {
    sm: { span: 7 },
  }
  const wrapperCol = {
    sm: { span: 13 },
  }

  const form = $ref({
    mchCode: undefined,
    mchAppCode: undefined,
  })

  let loading = $ref(false)
  let wallet = $ref<Wallet>()

  // 商户和应用下拉列表
  let mchList = $ref<LabeledValue[]>()
  let mchAppList = $ref<LabeledValue[]>()

  onMounted(() => {
    init()
  })

  /**
   * 初始化信息
   */
  function init() {
    // 商户下拉列表
    mchDrop().then(({ data }) => {
      mchList = data
    })
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
   * 初始化钱包信息
   */
  async function getWallet() {
    const { data } = await findByUser(form)
    wallet = data
    loading = false
  }

  /**
   * 开通钱包
   */
  async function createMyWallet() {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否开通我的钱包',
      onOk: async () => {
        await createWallet(form)
        createMessage.success('钱包开通中...')
        await getWallet()
      },
    })
  }
</script>

<style scoped lang="less">
  .vben-basic-title {
    font-size: 14px;
  }
</style>
