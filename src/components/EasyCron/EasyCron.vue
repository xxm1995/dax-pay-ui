<template>
  <div :class="`${prefixCls}`">
    <EasyCronModal
      @register="registerModal"
      @ok="ok"
      v-model:value="editCronValue"
      :exeStartTime="exeStartTime"
      :hideYear="hideYear"
      :remote="remote"
      :hideSecond="hideSecond"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useModal } from '/@/components/Modal'
  import { propTypes } from '/@/utils/propTypes'
  import EasyCronModal from './EasyCronModal.vue'
  import { cronEmits, cronProps } from './easy.cron.data'

  const { prefixCls } = useDesign('easy-cron-input')
  const emit = defineEmits([...cronEmits, 'ok'])
  const props = defineProps({
    ...cronProps,
    exeStartTime: propTypes.oneOfType([propTypes.number, propTypes.string, propTypes.object]).def(0),
  })
  const [registerModal, { openModal }] = useModal()
  const editCronValue = ref('* * * * * ? *')

  watch(
    () => props.value,
    (newVal) => {
      if (!newVal) {
        editCronValue.value = '* * * * * ? *'
        return
      }
      if (newVal !== editCronValue.value) {
        editCronValue.value = newVal
      }
    },
  )

  function showConfigModal() {
    if (!props.disabled) {
      openModal()
    }
  }
  function ok() {
    emit('ok', editCronValue.value)
  }
  defineExpose({
    showConfigModal,
  })
</script>

<style lang="less">
  @import 'easy.cron.input';
</style>
