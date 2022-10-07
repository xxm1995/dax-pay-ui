<template>
  <a-col :md="field.md || md" :sm="24">
    <a-form-item :label="field.name">
      <!-- 文本输入 -->
      <a-input
        allowClear
        v-if="field.type === STRING"
        :placeholder="field.placeholder ? field.placeholder : '请输入查询值'"
        v-model:value="queryParams[field.field]"
      />
      <!-- 数字输入 -->
      <a-input-number
        allowClear
        style="width: 100%"
        v-else-if="field.type === NUMBER"
        :placeholder="field.placeholder ? field.placeholder : '请输入查询值'"
        :precision="field.precision ? field.precision : 0"
        v-model:value="queryParams[field.field]"
      />
      <!-- 布尔 -->
      <a-radio-group v-else-if="field.type === BOOLEAN" v-model:value="queryParams[field.field]">
        <a-radio :value="true">是</a-radio>
        <a-radio :value="false">否</a-radio>
      </a-radio-group>
      <!-- 列表 -->
      <a-select
        allowClear
        v-else-if="field.type === LIST"
        :placeholder="field.placeholder ? field.placeholder : '请选择查询值'"
        v-model:value="queryParams[field.field]"
        :options="field.list"
      />
      <!-- 日期 -->
      <a-date-picker
        allowClear
        v-else-if="field.type === DATE"
        style="width: 100%"
        :placeholder="field.placeholder ? field.placeholder : '请选择日期'"
        :valueFormat="queryParams.format ? queryParams.format : 'yyyy-MM-DD'"
        v-model:value="queryParams[field.field]"
      />
      <!-- 时间 -->
      <a-time-picker
        allowClear
        v-else-if="field.type === TIME"
        style="width: 100%"
        :placeholder="field.placeholder ? field.placeholder : '请选择时间'"
        :valueFormat="queryParams.format ? queryParams.format : 'HH:mm:ss'"
        v-model:value="queryParams[field.field]"
      />
      <!-- 日期时间 -->
      <a-date-picker
        allowClear
        showTime
        v-else-if="field.type === DATE_TIME"
        style="width: 100%"
        :placeholder="field.placeholder ? field.placeholder : '请选择日期时间'"
        :valueFormat="queryParams.format ? queryParams.format : 'yyyy-MM-DD HH:mm:ss'"
        v-model:value="queryParams[field.field]"
      />
      <!-- 默认文本输入 -->
      <a-input
        allowClear
        v-else
        :placeholder="field.placeholder ? field.placeholder : '请输入查询值'"
        v-model:value="queryParams[field.field]"
      />
    </a-form-item>
  </a-col>
</template>

<script lang="ts" setup>
  import { BOOLEAN, DATE, DATE_TIME, LIST, NUMBER, QueryField, STRING, TIME } from './SuperQueryCode'
  const props = withDefaults(
    defineProps<{
      // 查询字段属性
      field: QueryField
      // 查询条件
      queryParams: object
      // md 栅格占位
      md: number
    }>(),
    {
      md: 6,
    },
  )
</script>

<style scoped></style>
