<template>
  <basic-modal
    title="选择文章"
    :width="750"
    :visible="visible"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <vxe-table row-id="id" :loading="loading" :data="tableData" :radio-config="{ highlight: true }" @radio-change="radioChange">
      <vxe-column width="50" type="radio" />
      <vxe-column field="titles" title="标题" />
      <vxe-column field="articleId" title="文章id" />
      <vxe-column field="updateTime" title="上传时间" />
    </vxe-table>
    <vxe-pager
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"
    />
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button :loading="loading" type="primary" :disabled="!articleId" @click="handleOk">选择</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
</script>

<style scoped></style>
