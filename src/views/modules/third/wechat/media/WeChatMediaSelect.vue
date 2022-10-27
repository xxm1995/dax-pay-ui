<template>
  <basic-modal
    title="选择素材"
    :width="750"
    :visible="visible"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="类型">
              <a-select v-model="queryParam.type" :default-value="queryParam.type" :options="mediaTypes" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-space>
              <a-button type="primary" @click="query">查询</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <vxe-table row-id="id" :loading="loading" :data="tableData" :radio-config="{ highlight: true }" @radio-change="radioChange">
      <vxe-column width="50" type="radio" />
      <vxe-column field="name" title="名称" />
      <vxe-column field="mediaId" title="媒体ID" />
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
        <a-button :loading="loading" type="primary" :disabled="!mediaId" @click="handleOk">选择</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
</script>

<style scoped></style>
