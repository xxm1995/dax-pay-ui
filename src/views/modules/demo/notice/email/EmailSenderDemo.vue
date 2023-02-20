<template>
  <div>
    <div class="m-3 p-3 pt-3 bg-white">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="简单邮件" force-render>
          <simple-email-sender />
        </a-tab-pane>
        <a-tab-pane key="2" tab="标准邮件" force-render>
          <standard-email-sender />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import SimpleEmailSender from './SimpleEmailSender.vue'
  import StandardEmailSender from './StandardEmailSender.vue'
</script>

<style scoped></style>
