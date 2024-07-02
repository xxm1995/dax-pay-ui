<template>
  <div :class="getClass">
    <template v-if="canFullscreen">
      <Tooltip title="还原" placement="bottom" v-if="fullScreen">
        <FullscreenExitOutlined role="full" @click="handleFullScreen" />
      </Tooltip>
      <Tooltip title="最大化" placement="bottom" v-else>
        <FullscreenOutlined role="close" @click="handleFullScreen" />
      </Tooltip>
    </template>
    <Tooltip title="关闭" placement="bottom">
      <CloseOutlined @click="handleCancel" />
    </Tooltip>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue'
  import { FullscreenExitOutlined, FullscreenOutlined, CloseOutlined } from '@ant-design/icons-vue'
  import { Tooltip } from 'ant-design-vue'
  import { useDesign } from '@/hooks/web/useDesign'

  defineOptions({ name: 'ModalClose' })

  const props = defineProps({
    canFullscreen: { type: Boolean, default: true },
    fullScreen: { type: Boolean },
  })

  const emit = defineEmits(['cancel', 'fullscreen'])

  const { prefixCls } = useDesign('basic-modal-close')

  const getClass = computed(() => {
    return [
      prefixCls,
      `${prefixCls}--custom`,
      {
        [`${prefixCls}--can-full`]: props.canFullscreen,
      },
    ]
  })

  function handleCancel(e: Event) {
    emit('cancel', e)
  }

  function handleFullScreen(e: Event) {
    e?.stopPropagation()
    e?.preventDefault()
    emit('fullscreen')
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-modal-close';
  .@{prefix-cls} {
    display: flex;
    align-items: center;
    height: 95%;

    > span {
      margin-left: 48px;
      font-size: 16px;
    }

    &--can-full {
      > span {
        margin-left: 12px;
      }
    }

    &:not(&--can-full) {
      > span:nth-child(1) {
        &:hover {
          font-weight: 700;
        }
      }
    }

    & span:nth-child(1) {
      display: inline-block;
      padding: 10px;

      &:hover {
        color: @primary-color;
      }
    }

    & span:last-child {
      &:hover {
        color: @error-color;
      }
    }
  }
</style>
