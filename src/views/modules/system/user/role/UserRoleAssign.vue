<template>
  <basic-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    :maskClosable="false"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-spin :spinning="loading">
      <a-form>

      </a-form>
    </a-spin>
  </basic-modal>
</template>

<script lang="ts" setup>
</script>

<style scoped>

</style>
