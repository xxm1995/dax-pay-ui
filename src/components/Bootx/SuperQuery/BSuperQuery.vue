<template>
  <span>
    <slot name="button">
      <a-tooltip v-if="queryState">
        <template #title>
          <span>查询条件生效</span>
          <a-divider type="vertical" />
          <a href="javascript:" @click="supperQueryReset">清空</a>
        </template>
        <a-button style="margin-left: 8px" @click="supperQueryShow">
          <icon :icon="buttonIcon" theme="twoTone" spin />
          <span>查询中...</span>
        </a-button>
      </a-tooltip>
      <a-button v-else style="margin-left: 8px" @click="supperQueryShow">{{ buttonTitle }}</a-button>
    </slot>
    <super-query-model ref="superQueryModal" :fields="fields" :width="width" :modelTitle="modelTitle" @ok="handleOk" />
  </span>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import { useMessage } from '/@/hooks/web/useMessage'
  import SuperQueryModel from './SuperQueryModel.vue'
  import { QueryField } from '/@/components/Bootx/Query/Query'

  // const{queryState=false,buttonTitle='超级查询',modelTitle,width} = defineProps<Props>()
  const props = withDefaults(
    defineProps<{
      // 查询状态
      queryState: boolean
      // 字段
      fields: QueryField[]
      // 按钮标题
      buttonTitle?: string
      // 按钮图标
      buttonIcon?: string
      // 标题名称
      modelTitle?: string
      // 宽度
      width?: number
    }>(),
    {
      // 查询状态, 是否在进行查询
      queryState: false,
      // 按钮标题
      buttonTitle: '超级查询',
      // 按钮图标
      buttonIcon: 'ant-design:appstore',
      // 标题名称
      modelTitle: '超级查询器',
      // 宽度
      width: 840,
    },
  )

  const emits = defineEmits(['reset', 'query'])

  const { createMessage } = useMessage()
  const superQueryModal = $ref<any>()
  // 显示
  function supperQueryShow() {
    superQueryModal.show()
  }
  // 重置
  function supperQueryReset() {
    superQueryModal.handleReset()
    emits('reset')
  }
  // 查询
  function handleOk(queryParams) {
    if (queryParams.length > 0) {
      emits('query', queryParams)
    } else {
      createMessage.warning('不能查询空条件')
    }
  }
  defineExpose({ supperQueryReset, supperQueryShow })
</script>

<style scoped></style>
