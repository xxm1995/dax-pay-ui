<template>
  <a v-if="disabled" disabled :href="href" style="color: #d2d2d2">
    <slot></slot>
  </a>
  <a v-else-if="danger" @click="onClick" :href="href" style="color: red">
    <slot></slot>
  </a>
  <a v-else :href="href" @click="onClick">
    <slot></slot>
  </a>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'ALink',
    inheritAttrs: false,
  })
</script>
<script lang="ts" setup>
  interface Props {
    // 菜单信息
    disabled?: boolean
    // 设置危险按钮(就是成红色的)
    danger?: boolean
    // 点击跳转的地址
    href?: string
    onClick?: Function
  }
  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    href: 'javascript:',
    danger: false,
  })
  const emits = defineEmits(['click'])

  function onClick() {
    emits('click')
  }
</script>

<style scoped></style>
