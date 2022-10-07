<template>
  <a-modal :visible="visible"> 123 </a-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  const visible = ref(false)
  const i = ref(3)

  const emits = defineEmits(['ok'])
  function edit() {
    console.log(123)
  }
  defineExpose({
    visible,
  })
</script>

<style scoped></style>
