<template>
  <div>
    <div class="m-3 p-3 bg-white">
      <a-spin :spinning="loading">
        <a-form ref="formRef" :validate-trigger="['blur', 'change']" :label-col="{ span: 12 }" :model="form" :rules="rules">
          <a-row>
            <a-col :span="20">
              <a-form-item class="w-800px" name="websiteUrl">
                <template #label>
                  <basic-title helpMessage="本支付系统的访问地址"> 系统地址 </basic-title>
                </template>
                <a-input placeholder="请输入支付系统的网站地址" v-model:value="form.websiteUrl" :disabled="!edit" />
              </a-form-item>
            </a-col>
            <a-col :span="20">
              <a-form-item class="w-800px" name="notifyUrl">
                <template #label>
                  <basic-title helpMessage="此处为业务系统接收通知的地址，系统将会将消息发送到该地址上"> 通知地址 </basic-title>
                </template>
                <a-input placeholder="请输入消息通知地址" v-model:value="form.notifyUrl" :disabled="!edit" />
              </a-form-item>
            </a-col>
            <a-col :span="20">
              <a-form-item class="w-800px" name="returnUrl">
                <template #label>
                  <basic-title helpMessage="此处为执行成功后跳转的客户系统接收通知的地址，如果业务系统调用时未配置将会跳转到该地址上">
                    同步支付通知地址
                  </basic-title>
                </template>
                <a-input placeholder="请输入同步支付跳转地址" v-model:value="form.returnUrl" :disabled="!edit" />
              </a-form-item>
            </a-col>
            <a-col :span="20">
              <a-form-item class="w-800px" name="reqSign">
                <template #label>
                  <basic-title helpMessage="开启后都有的支付请求都会进行参数校验"> 签名校验 </basic-title>
                </template>
                <a-radio-group v-model:value="form.reqSign" button-style="solid" :disabled="!edit">
                  <a-radio-button :value="true">开启</a-radio-button>
                  <a-radio-button :value="false">关闭</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="20" v-if="form.reqSign">
              <a-form-item label="签名方式" class="w-800px" name="signType">
                <a-radio-group v-model:value="form.signType" button-style="solid" :disabled="!edit">
                  <a-radio-button value="MD5">MD5</a-radio-button>
                  <a-radio-button value="HMAC_SHA256">SHA256</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="20" v-if="form.reqSign">
              <a-form-item label="签名秘钥" class="w-800px" name="signSecret">
                <a-input placeholder="请输入签名秘钥" v-model:value="form.signSecret" :disabled="!edit" />
              </a-form-item>
            </a-col>
            <a-col :span="20">
              <a-form-item class="w-800px" name="limitAmount">
                <template #label>
                  <basic-title helpMessage="每次发起支付的金额不能超过该值，如果同时配置了通道支付限额，则以额度低的为准">
                    订单限额(元)
                  </basic-title>
                </template>
                <a-input-number
                  placeholder="请输入订单限额"
                  v-model:value="form.limitAmount"
                  :min="0.01"
                  :precision="2"
                  :disabled="!edit"
                />
              </a-form-item>
            </a-col>
            <a-col :span="20">
              <a-form-item label="订单默认超时时间(分钟)" class="w-800px" name="orderTimeout">
                <a-input-number
                  :disabled="!edit"
                  placeholder="请输入订单默认超时时间(分钟)"
                  :precision="0"
                  :min="5"
                  v-model:value="form.orderTimeout"
                />
              </a-form-item>
            </a-col>
            <a-col :span="20">
              <a-form-item class="w-800px" name="reqTimeout">
                <template #label>
                  <basic-title helpMessage="调用支付相关接口时传输的请求时间早于当前服务时间, 且差值超过配置的时长, 将会拦截请求">
                    请求有效时长(秒)
                  </basic-title>
                </template>
                <a-input-number
                  :disabled="!edit"
                  placeholder="请输入请求有效时长(秒)"
                  :precision="0"
                  :min="5"
                  v-model:value="form.reqTimeout"
                />
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
  import { onMounted, computed } from 'vue'
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

  const rules = computed(() => {
    return {
      limitAmount: [{ required: true, message: '请输入订单支付限额' }],
      reqSign: [{ required: true, message: '请选择签名类型' }],
      signType: [{ required: form.reqSign, message: '请选择签名类型' }],
      signSecret: [{ required: form.reqSign, message: '请输入签名密钥' }],
      orderTimeout: [{ required: true, message: '请输入订单默认超时时间(分钟)' }],
      reqTimeout: [{ required: true, message: '请输入请求有效时长(秒)' }],
    } as Record<string, Rule[]>
  })

  onMounted(() => initData())

  /**
   * 初始化数据
   */
  function initData() {
    edit = false
    loading = true
    getConfig().then(({ data }) => {
      // 分转元
      if (data.limitAmount) {
        data.limitAmount = data.limitAmount / 100
      }
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
        const updateFrom = { ...form }
        // 元转分
        if (updateFrom.limitAmount) {
          updateFrom.limitAmount = updateFrom.limitAmount * 100
        }
        await update(updateFrom)
        edit = false
        createMessage.success('更新成功')
        initData()
      },
    })
  }
</script>

<style lang="less" scoped></style>
