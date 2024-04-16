<template>
  <basic-modal
    title="查看"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions bordered title :column="{ md: 1, sm: 1, xs: 1 }">
        <a-descriptions-item label="钱包ID">{{ wallet.id }}</a-descriptions-item>
        <a-descriptions-item label="用户ID">{{ wallet.userId }}</a-descriptions-item>
        <a-descriptions-item label="钱包名称">{{ wallet.name }}</a-descriptions-item>
        <a-descriptions-item label="余额(分)">{{ wallet.balance }}</a-descriptions-item>
        <a-descriptions-item label="状态" ><span :style="statusClass()">{{ dictConvert('WalletStatus', wallet.status) }}</span></a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ wallet.createTime }}</a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
import { get, Wallet } from './Wallet.api'
import { $ref } from 'vue/macros'
import { BasicModal } from '/@/components/Modal'
import useFormEdit from '/@/hooks/bootx/useFormEdit'
import { useDict } from '/@/hooks/bootx/useDict'

const {
  initFormEditType,
  handleCancel,
  search,
  labelCol,
  wrapperCol,
  modalWidth,
  title,
  confirmLoading,
  visible,
  editable,
  showable,
  formEditType,
} = useFormEdit()
const { dictConvert } = useDict()

let loading = $ref(false)
let wallet = $ref<Wallet>({})

/**
 * 入口
 */
function init(record: Wallet) {
  visible.value = true
  wallet = record
  initData(record.id as string)
}
function statusClass()  {
  console.log('statusClass')
  if (wallet.status == 'normal') {
    return { color: 'green' }
  } else {
    return { color: 'red' }
  }
}
/**
 * 初始化数据
 */
async function initData(walletId: string) {
  loading = true
  const { data } = await get(walletId)
  loading = false
  wallet = data
}

defineExpose({ init })
</script>

<style scoped lang="less"></style>
