<template>
  <basic-drawer showFooter v-bind="$attrs" width="60%" title="钱包支付配置" :visible="visible" :maskClosable="false" @close="handleCancel">
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
          <a-input v-model:value="form.id" />
        </a-form-item>
        <a-form-item label="是否启用" name="enable">
          <a-switch checked-children="启用" un-checked-children="停用" v-model:checked="form.enable" />
        </a-form-item>
        <a-form-item name="limitAmount">
          <template #label>
            <basic-title helpMessage="每次发起支付的金额不能超过该值，如果同时配置了全局支付限额，则以额度低的为准">
              支付限额(元)
            </basic-title>
          </template>
          <a-input-number :precision="2" :min="0.01" v-model:value="form.limitAmount" placeholder="请输入支付限额(元)" />
        </a-form-item>
        <a-form-item label="支持支付方式" name="payWays">
          <a-select
            allowClear
            mode="multiple"
            v-model:value="form.payWays"
            :disabled="showable"
            :options="payWayList"
            style="width: 100%"
            placeholder="选择支付方式"
          />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="form.remark" placeholder="请输入备注" />
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-drawer>
</template>

<script setup lang="ts">
  import { computed, nextTick } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { update, WalletConfig, findPayWays, getConfig } from './WalletConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { BasicDrawer } from '/@/components/Drawer'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useMessage } from '/@/hooks/web/useMessage'
  import BasicTitle from "/@/components/Basic/src/BasicTitle.vue";
  const { handleCancel, labelCol, wrapperCol, confirmLoading, visible, showable } = useFormEdit()
  // 读取证书内容
  const { createMessage } = useMessage()

  const formRef = $ref<FormInstance>()

  let payWayList = $ref<LabeledValue[]>([])

  let form = $ref<WalletConfig>({})

  // 校验
  const rules = computed(() => {
    return {
      enable: [{ required: true, message: '请选择是否启用' }],
      limitAmount: [{ required: true, message: '请输入支付限额' }],
      payWays: [{ required: true, message: '请选择支持的支付类型' }],
    } as Record<string, Rule[]>
  })

  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 入口
   */
  function init() {
    visible.value = true
    resetForm()
    getInfo()
  }
  /**
   * 获取信息
   */
  function getInfo() {
    confirmLoading.value = true
    findPayWays().then(({ data }) => {
      payWayList = data
    })
    getConfig().then(({ data }) => {
      // 分转元
      if (data.limitAmount) {
        data.limitAmount = data.limitAmount / 100
      }
      form = data
      confirmLoading.value = false
    })
  }
  /**
   * 更新
   */
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      const updateFrom = { ...form }
      // 元转分
      if (updateFrom.limitAmount) {
        updateFrom.limitAmount = updateFrom.limitAmount * 100
      }
      await update(updateFrom)
      confirmLoading.value = false
      handleCancel()
      createMessage.success('保存成功')
      emits('ok')
    })
  }

  // 重置表单
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
