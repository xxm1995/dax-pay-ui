<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :title="title"
    :width="modalWidth"
    :visible="visible"
    @cancel="handleCancel"
  >
    <a-descriptions bordered title="" :column="{ md: 1, sm: 1, xs: 1 }">
      <a-descriptions-item label="钱包ID">
        {{ form.id }}
      </a-descriptions-item>
      <a-descriptions-item label="账号ID">
        {{ form.userId }}
      </a-descriptions-item>
      <a-descriptions-item label="用户名称">
        {{ form.userName }}
      </a-descriptions-item>
      <a-descriptions-item label="钱包余额">
        {{ form.balance }}
      </a-descriptions-item>
      <a-descriptions-item label="状态">
        {{ dictConvert('WalletStatus', form.status) }}
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { nextTick, reactive } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, getWalletInfo, update, Wallet } from "./Wallet.api";
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  const {
    initFormEditType,
    handleCancel,
    modalWidth,
    title,
    confirmLoading,
    visible,
  } = useFormEdit()
  const { dictConvert } = useDict()

  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<Wallet>({
    id: null,
    userId: '',
    balance: 0,
    status: 0,
    userName: '',
  })
  // 入口
  function init(id) {
    visible.value = true
    confirmLoading.value = true
    getWalletInfo(id).then(({ data }) => {
      form = data
      confirmLoading.value = false
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
