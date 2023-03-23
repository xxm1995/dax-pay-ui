<template>
  <div ref="propertyPanel" class="property-panel" v-show="getComponent">
    <div v-if="nodeName" style="display: none">{{ nodeName }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { $ref } from '@vue-macros/reactivity-transform/macros'

  let nodeName = $ref<string>()
  let getComponent = $ref<any>()
</script>

<style lang="less" scoped>
  .property-panel {
    padding: 20px 20px;
    // reset element css
    .el-form--label-top .el-form-item__label {
      padding: 0;
    }
    .el-form-item {
      margin-bottom: 6px;
    }
    .tab-table .el-form-item {
      margin-bottom: 16px;
    }
    .node-name {
      border-bottom: 1px solid #ccc;
      padding: 0 0 10px 20px;
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: bold;
      color: #444;
    }
  }
</style>
