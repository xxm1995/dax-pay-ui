<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="900"
    :title="title"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        class="small-from-item"
        ref="formRef"
        :model="form"
        :rules="rules"
        :validate-trigger="['blur', 'change']"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="接收方编号" validate-first name="receiverNo">
          <a-input v-model:value="form.receiverNo" :disabled="!addable" placeholder="请输入接收方编号" />
        </a-form-item>
        <a-form-item label="所属通道" name="channel">
          <a-select
            style="width: 100%"
            v-model:value="form.channel"
            :disabled="!addable"
            :options="payChannelList"
            placeholder="请选择所属通道"
            @change="channelChange"
          />
        </a-form-item>
        <a-form-item v-if="form.channel" label="接收方类型" name="receiverType">
          <a-select
            style="width: 100%"
            v-model:value="form.receiverType"
            :disabled="!addable"
            :options="receiverTypeList"
            placeholder="请选择接收方类型"
          />
        </a-form-item>
        <a-form-item label="接收方账号" name="receiverAccount">
          <a-input v-model:value="form.receiverAccount" :disabled="!addable" placeholder="请输入接收方账号">
            <template v-if="['wx_personal', 'ali_open_id'].includes(form.receiverType as string) && addable" #suffix>
              <icon icon="ant-design:qrcode-outlined" @click="showQrCode" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="接收方姓名" name="receiverName">
          <a-input v-model:value="form.receiverName" :disabled="!addable" placeholder="请输入接收方姓名" />
        </a-form-item>
        <a-form-item label="分账关系类型" name="relationType">
          <a-select
            style="width: 100%"
            v-model:value="form.relationType"
            :disabled="!addable"
            :options="relationTypeList"
            placeholder="请选择分账关系类型"
          />
        </a-form-item>
        <a-form-item v-if="form.relationType === 'CUSTOM'" label="接收者关系名称" name="relationName">
          <a-input v-model:value="form.relationName" :disabled="!addable" placeholder="请输入接收者关系名称" />
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
    <open-id-qr-code ref="openIdQrCode"  @close="pauseFun" />
  </basic-modal>
</template>

<script setup lang="ts">
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { computed, nextTick } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { add, get, AllocationReceiver, update, findChannels, findReceiverTypeByChannel, existsByNo } from './AllocationReceiver.api'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import Icon from '/@/components/Icon'
  import { generateAliAuthUrl, generateWxAuthUrl, queryAliOpenId, queryWxOpenId } from '/@/api/payment/WechatOpenId.api'
  import OpenIdQrCode from './OpenIdQrCode.vue'
  import { useIntervalFn } from '@vueuse/shared'
  import QrCode from "/@/components/Qrcode/src/Qrcode.vue";

  const {
    initFormEditType,
    handleCancel,
    diffForm,
    labelCol,
    wrapperCol,
    title,
    confirmLoading,
    visible,
    addable,
    showable,
    formEditType,
  } = useFormEdit()
  const { createMessage } = useMessage()
  const { dictDropDown } = useDict()

  let pauseFun = () => {}
  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<AllocationReceiver>({})
  let rawForm = $ref<AllocationReceiver>({})
  let payChannelList = $ref<LabeledValue[]>([])
  let receiverTypeList = $ref<LabeledValue[]>([])
  let relationTypeList = $ref<LabeledValue[]>([])

  const openIdQrCode = $ref<any>()

  // 校验
  const rules = computed(() => {
    return {
      receiverNo: [
        { required: true, message: '请输入账号编号' },
        { trigger: 'blur', validator: validateCode },
      ],
      channel: [{ required: true, message: '请选择所属通道' }],
      receiverType: [{ required: true, message: '请选择分账接收方类型' }],
      receiverAccount: [{ required: true, message: '请输入接收方账号' }],
      relationType: [{ required: true, message: '请选择分账关系类型' }],
      relationName: [{ required: form.relationType === 'CUSTOM', message: '请输入类型关系名称' }],
    } as Record<string, Rule[]>
  })

  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  function init(record, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    initData()
    getInfo(record, editType)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    findChannels().then(({ data }) => (payChannelList = data))
    relationTypeList = await dictDropDown('AllocRelationType')
  }

  /**
   * 获取信息
   */
  async function getInfo(record, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      await get(record.id).then(({ data }) => {
        form = data
        rawForm = { ...form }
      })
      confirmLoading.value = false
      findReceiverTypeByChannel(form.channel).then(({ data }) => (receiverTypeList = data))
    } else {
      confirmLoading.value = false
    }
  }

  /**
   * 通道变动
   */
  function channelChange() {
    findReceiverTypeByChannel(form.channel).then(({ data }) => (receiverTypeList = data))
    form.receiverType = undefined
  }

  /**
   * 保存
   */
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      try {
        if (formEditType.value === FormEditType.Add) {
          await add(form)
        } else if (formEditType.value === FormEditType.Edit) {
          await update({ ...form, ...diffForm(rawForm, form, 'receiverAccount', 'receiverName') })
        }
      } finally {
        confirmLoading.value = false
      }
      emits('ok')
      handleCancel()
    })
  }

  /**
   * 扫码绑定
   */
  function showQrCode() {
    // 微信
    if (form.receiverType === 'wx_personal') {
      getWxOpenId()
    }
    if (form.receiverType === 'ali_open_id') {
      getAliOpenId()
    }
  }

  /**
   * 获取微信OpenId
   */
  async function getWxOpenId() {
    // 获取微信认证链接
    const { data: urlResult } = await generateWxAuthUrl()
    openIdQrCode.init(urlResult.authUrl, '请使用微信客户端"扫一扫"')
    // 轮训查询
    const { pause, resume } = useIntervalFn(
      () => {
        queryWxOpenId(urlResult.code)
          .then((res) => {
            // 成功
            if (res.data.status === 'success') {
              openIdQrCode.handleClose()
              createMessage.success('获取OpenID成功')
              form.receiverAccount = res.data.openId
              pause()
            }
          })
          .catch((err) => {
            // 失败
            openIdQrCode.handleClose()
            pause()
          })
      },
      1000 * 3,
      { immediate: false },
    )
    pauseFun = pause
    resume()
  }

  /**
   * 获取支付宝OpenId
   */
  async function getAliOpenId() {
    // 获取支付宝认证链接
    const { data: urlResult } = await generateAliAuthUrl()
    openIdQrCode.init(urlResult.authUrl, '请使用支付宝客户端"扫一扫"')
    // 轮训查询
    const { pause, resume } = useIntervalFn(
      () => {
        queryAliOpenId(urlResult.code)
          .then((res) => {
            // 成功
            if (res.data.status === 'success') {
              openIdQrCode.handleClose()
              createMessage.success('获取OpenID成功')
              form.receiverAccount = res.data.openId
              pause()
            }
          })
          .catch((err) => {
            // 失败
            openIdQrCode.handleClose()
            pause()
          })
      },
      1000 * 3,
      { immediate: false },
    )
    pauseFun = pause
    resume()
  }

  /**
   * 校验编码重复
   */
  async function validateCode() {
    const { receiverNo } = form
    const res = await existsByNo(receiverNo)
    return res.data ? Promise.reject('该接收方编号已经存在') : Promise.resolve()
  }

  /**
   * 重置表单
   */
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
