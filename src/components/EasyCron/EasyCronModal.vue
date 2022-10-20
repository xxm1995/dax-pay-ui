<template>
  <BasicModal @register="registerModal" title="Cron表达式" width="800px" @ok="onOk">
    <easy-cron-inner v-bind="attrs" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useAttrs } from '/@/hooks/core/useAttrs'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import EasyCronInner from './EasyCronInner.vue'

  export default defineComponent({
    name: 'EasyCronModal',
    components: { EasyCronInner, BasicModal },
    inheritAttrs: false,
    // emits: ['ok'],
    setup(props, ctx) {
      const attrs = useAttrs()
      const [registerModal, { closeModal }] = useModalInner()

      function onOk() {
        closeModal()
        ctx.emit('ok')
      }

      return { attrs, registerModal, onOk }
    },
  })
</script>
