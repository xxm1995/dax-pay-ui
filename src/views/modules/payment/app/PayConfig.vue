<template>
  <basic-drawer showFooter v-bind="$attrs" title="支付参数配置" width="70%" :visible="visible" :maskClosable="false" @close="handleCancel">
    <a-spin :spinning="confirmLoading" />
    <template #footer>
      <a-button key="cancel" @click="handleCancel">关闭</a-button>
    </template>
  </basic-drawer>
</template>

<script setup lang="ts">
  import { BasicDrawer } from '/@/components/Drawer'
  import { $ref } from 'vue/macros'

  let confirmLoading = $ref(false)
  let visible = $ref(false)

  /**
   * 初始化并展示
   */
  function show(appNo) {
    visible = true
    console.log(appNo)
  }

  /**
   * 关闭
   */
  function handleCancel() {
    visible = false
  }

  defineExpose({ show })
</script>

<style scoped lang="less"></style>
