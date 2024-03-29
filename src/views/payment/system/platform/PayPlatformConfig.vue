<template>
  <div>
    <div class="m-3 p-3 bg-white">
      <a-spin :spinning="loading">
        <a-form ref="formRef" :validate-trigger="['blur', 'change']" :label-col="{ span: 12 }" :model="form" :rules="rules">
          <a-row>
            <a-col :offset="2" :span="10">
              <a-form-item class="w-400px" name="limitAmount">
                <template #label>
                  <basic-title helpMessage="一次订单支付时最高可以支付的金额，单位为分"> 订单限额(分) </basic-title>
                </template>
                <a-input placeholder="请输入订单限额" v-model:value="form.limitAmount" :disabled="!edit" />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="订单默认超时时间(分钟)" class="w-400px" name="orderTimeout">
                <a-input-number
                  :disabled="!edit"
                  placeholder="请输入订单默认超时时间(分钟)"
                  :precision="0"
                  :min="5"
                  v-model:value="form.orderTimeout"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :offset="2" :span="10">
              <a-form-item label="签名方式" class="w-400px" name="signType">
                <a-radio-group v-model:value="form.signType" button-style="solid" :disabled="!edit">
                  <a-radio-button value="MD5">MD5</a-radio-button>
                  <a-radio-button value="HMAC_SHA256">SHA256</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="签名秘钥" class="w-400px" name="signSecret">
                <a-input placeholder="请输入签名秘钥" v-model:value="form.signSecret" :disabled="!edit" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :offset="2" :span="10">
              <a-form-item class="w-400px" name="notifyUrl">
                <template #label>
                  <basic-title helpMessage="此处为客户系统接收通知的地址，如果接口中未配置，系统将会将消息发送到该地址上">
                    异步支付通知地址
                  </basic-title>
                </template>
                <a-input placeholder="请输入异步支付通知地址" v-model:value="form.notifyUrl" :disabled="!edit" />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item class="w-400px" name="returnUrl">
                <template #label>
                  <basic-title helpMessage="此处为执行成功后跳转的客户系统接收通知的地址，如果接口中未配置，将会跳转到该地址上">
                    同步支付通知地址
                  </basic-title>
                </template>
                <a-input placeholder="请输入同步支付跳转地址" v-model:value="form.returnUrl" :disabled="!edit" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :push="8">
              <a-button v-if="edit" @click="initData">取消</a-button>
              <a-button v-if="edit" style="margin-left: 50px" type="primary" @click="updateConfig">更新</a-button>
              <a-button v-if="!edit" @click="edit = true">编辑信息</a-button>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue'
  import { getConfig, update, PayPlatformConfig } from './PayPlatformConfig.api'
  import { $ref } from 'vue/macros'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { useMessage } from '/@/hooks/web/useMessage'
  import BasicTitle from '/@/components/Basic/src/BasicTitle.vue'

  const { createConfirm, createMessage } = useMessage()

  let form = $ref<PayPlatformConfig>({})
  let loading = $ref(false)
  const formRef = $ref<FormInstance>()
  let edit = $ref(false)

  const rules = reactive({
    limitAmount: [{ required: true, message: '请输入订单支付限额' }],
    signType: [{ required: true, message: '请选择签名类型' }],
    signSecret: [{ required: true, message: '请输入签名密钥' }],
    orderTimeout: [{ required: true, message: '请输入订单默认超时时间(分钟)' }],
  } as Record<string, Rule[]>)

  onMounted(() => initData())

  /**
   * 初始化数据
   */
  function initData() {
    edit = false
    loading = true
    getConfig().then(({ data }) => {
      form = data
      loading = false
    })
  }

  /**
   * 保存或更新配置
   */
  async function updateConfig() {
    await formRef?.validate()
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否支付配置相关信息',
      onOk: async () => {
        loading = true
        await update(form)
        edit = false
        createMessage.success('更新成功')
        initData()
      },
    })
  }
</script>

<style lang="less" scoped></style>
