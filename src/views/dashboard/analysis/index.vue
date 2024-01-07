<template>
  <div class="p-4">
    <a-card :bordered="false" :loading="loading">
      <h1>欢迎使用后台管理系统</h1>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'

  const loading = ref(true)

  setTimeout(() => {
    loading.value = false
  }, 1500)
</script>
