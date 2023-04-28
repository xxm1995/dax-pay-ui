<template>
  <div>
    <template v-if="params?.length">
      <a-row type="flex" style="margin-top: 10px" :gutter="16" v-for="(param, index) in params" :key="index">
        <a-col :span="3">
          <a-select v-model:value="param.or" class="w-full">
            <a-select-option value="false">且</a-select-option>
            <a-select-option value="true">或</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-select
            class="w-full"
            placeholder="选择查询字段"
            v-model:value="param.paramName"
            @change="(value) => fieldChange(value, index, param)"
          >
            <a-select-option v-for="o in fields" :key="o.field" :value="o.field"> {{ o.name }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-select placeholder="选择匹配规则" v-model:value="param.compareType" class="w-full">
            <a-select-option v-for="o in compareTypeList" :key="o.type" :value="o.type"> {{ o.name }}</a-select-option>
          </a-select>
        </a-col>
        <!-- 查询值输入 -->
        <a-col :span="8">
          <!-- 判断条件是否是判空 -->
          <a-input class="w-full" disabled v-if="['is_null', 'not_null'].includes(param.compareType)" value="空" />
          <!-- 文本输入 -->
          <a-input class="w-full" v-else-if="paramTypeJudge(index, STRING)" placeholder="请输入查询值" v-model:value="param.paramValue" />
          <!-- 数字输入 -->
          <a-input-number
            class="w-full"
            v-else-if="paramTypeJudge(index, NUMBER)"
            placeholder="请输入查询值"
            :precision="param.precision ? param.precision : 0"
            v-model:value="param.paramValue"
          />
          <!-- 布尔 -->
          <a-radio-group v-else-if="paramTypeJudge(index, BOOLEAN)" v-model:value="param.paramValue">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
          <!-- 列表 -->
          <a-select
            class="w-full"
            v-else-if="paramTypeJudge(index, LIST)"
            placeholder="请选择查询值"
            v-model:value="param.paramValue"
            :options="getSelectData(index)"
          />
          <!-- 日期 -->
          <a-date-picker
            class="w-full"
            v-else-if="paramTypeJudge(index, DATE)"
            placeholder="请选择日期"
            :valueFormat="param.format ? param.format : 'YYYY-MM-DD'"
            v-model:value="param.paramValue"
          />
          <!-- 时间 -->
          <a-time-picker
            class="w-full"
            v-else-if="paramTypeJudge(index, TIME)"
            placeholder="请选择时间"
            :valueFormat="param.format ? param.format : 'HH:mm:ss'"
            v-model:value="param.paramValue"
          />
          <!-- 日期时间 -->
          <a-date-picker
            showTime
            class="w-full"
            v-else-if="paramTypeJudge(index, DATE_TIME)"
            placeholder="请选择日期时间"
            :valueFormat="param.format ? param.format : 'YYYY-MM-DD HH:mm:ss'"
            v-model:value="param.paramValue"
          />
          <!-- 默认文本输入 -->
          <a-input class="w-full" v-else placeholder="请输入查询值" v-model:value="param.paramValue" />
        </a-col>
        <a-col :span="4">
          <a-button @click="handleAddNested(param)" pre-icon="ant-design:plus" />&nbsp;
          <a-button @click="handleDel(index)" pre-icon="ant-design:minus" />
        </a-col>
        <a-col v-if="param.nestedParams" :span="1" />
        <a-col v-if="param.nestedParams" :span="23">
          <super-query-item :fields="fields" :query-params="param.nestedParams" />
        </a-col>
      </a-row>
    </template>
    <a-empty description="查询条件为空" v-else />
  </div>
</template>

<script lang="ts" setup>
  import { NUMBER, STRING, BOOLEAN, DATE, TIME, DATE_TIME, LIST, QueryField, QueryParam } from '/@/components/Bootx/Query/Query'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { watch, watchEffect } from 'vue'
  interface Props {
    fields: QueryField[]
    queryParams: QueryParam[]
  }
  const props = withDefaults(defineProps<Props>(), {})
  const emit = defineEmits(['change', 'update:queryParams'])
  let params = $ref<QueryParam[]>([])

  watchEffect(() => {
    params = props.queryParams
  })
  // 虽然有没有这个都不影响, 但这是官方的写法, 留着吧
  watch(
    () => params,
    (v) => {
      emit('update:queryParams', v)
    },
  )

  const compareTypeList = [
    { type: 'eq', name: '等于' },
    { type: 'ne', name: '不等于' },
    { type: 'like', name: '模糊' },
    { type: 'like_left', name: '左模糊' },
    { type: 'like_right', name: '右模糊' },
    { type: 'not_like', name: 'NOT LIKE' },
    { type: 'gt', name: '大于' },
    { type: 'ge', name: '大于等于' },
    { type: 'lt', name: '小于' },
    { type: 'le', name: '小于等于' },
    { type: 'is_null', name: '为空' },
    { type: 'not_null', name: '不为空' },
  ]
  // 页面中查询字段对应的字段属性相关信息的存储, 顺序与查询条件参数一致
  let fieldTemps = $ref<QueryField[]>([])

  // 添加子查询条件
  function handleAddNested(item: QueryParam) {
    if (!item.nestedParams) {
      item.nestedParams = []
    }
    item.nestedParams.push({
      compareType: 'eq',
      or: 'false',
    })
  }

  // 删除
  function handleDel(index) {
    params.splice(index, 1)
    fieldTemps.splice(index, 1)
  }
  // 变更查询字段
  function fieldChange(value, index, queryParam) {
    // 查询出对应的字段
    const field = props.fields.filter((o) => o.field === value)
    if (field && field.length > 0) {
      fieldTemps[index] = field[0]
      queryParam.paramValue = undefined
    }
  }
  // 输入类型判断
  function paramTypeJudge(index, types) {
    const field = fieldTemps[index]
    for (const argument of arguments) {
      if (field && field.type === argument) {
        return true
      }
    }
    return false
  }
  // 获取下拉选择的数据
  function getSelectData(index) {
    return fieldTemps[index].selectList || []
  }
</script>

<style scoped></style>
