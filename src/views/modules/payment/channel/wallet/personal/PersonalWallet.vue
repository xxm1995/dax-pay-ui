<template>
  <a-card :bordered="false">
    <a-spin :spinning="loading">
      <div v-if="wallet">
        <a-form ref="formRef" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="状态">
            {{ dictConvert('WalletStatus', wallet.status) }}
          </a-form-item>
          <a-form-item label="余额">
            {{ wallet.balance }}
          </a-form-item>
          <a-form-item>
            <template #label>
              <basic-title
                helpMessage="输入网址或以outside://开头会的路径从外部打开页面，请求路径后添加?onlytab=1&__full__参数后，只显示显示标签页内容"
                >预冻结额度</basic-title
              >
            </template>
            {{ wallet.freezeBalance }}
          </a-form-item>
        </a-form>
      </div>
      <div v-else>
        <a-button type="primary" @click="createMyWallet">开通钱包</a-button>
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

  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  const labelCol = {
    sm: { span: 7 },
  }
  const wrapperCol = {
    sm: { span: 13 },
  }

  let loading = $ref(false)
  let wallet = $ref<Wallet>()

  onMounted(() => {
    initWallet()
  })

  /**
   * 初始化钱包信息
   */
  async function initWallet() {
    loading = true
    const { data } = await findByUser()
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
        await createWallet()
        createMessage.success('钱包开通中...')
        await initWallet()
      },
    })
  }
</script>

<style scoped lang="less">
  .vben-basic-title {
    font-size: 14px;
  }
</style>
