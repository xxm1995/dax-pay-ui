<template>
  <a-card :bordered="false">
    <a-spin :spinning="loading">
    </a-spin>
  </a-card>
</template>
<script setup lang="ts">
  import { $ref } from 'vue/macros'
  import { Wallet } from '/@/views/modules/payment/wallet/Wallet.api'

  let loading = $ref(false)
  let wallet = $ref<Wallet>()
  /**
   * 初始化钱包信息
   */
  function initWallet(){

  }

</script>

<style scoped lang="less"></style>
