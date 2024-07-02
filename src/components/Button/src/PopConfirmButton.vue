<script lang="ts">
  import { computed, defineComponent, h, unref } from 'vue'
  import BasicButton from './BasicButton.vue'
  import { Popconfirm } from 'ant-design-vue'
  import { extendSlots } from '@/utils/helper/tsxHelper'
  import { omit } from 'lodash-es'
  import { useAttrs } from '@vben/hooks'

  const props = {
    /**
     * Whether to enable the drop-down menu
     * @default: true
     */
    enable: {
      type: Boolean,
      default: true,
    },
  }

  export default defineComponent({
    name: 'PopButton',
    inheritAttrs: false,
    props,
    setup(props, { slots }) {
      const attrs = useAttrs()

      // get inherit binding value
      const getBindValues = computed(() => {
        return Object.assign(
          {
            okText: '确认',
            cancelText: '取消',
          },
          { ...props, ...unref(attrs) },
        )
      })

      return () => {
        // 用 omit 剔除一些已知可能导致异常的属性
        const bindValues = omit(unref(getBindValues), 'icon', 'color')
        const btnBind = omit(unref(getBindValues), 'title') as any
        if (btnBind.disabled) btnBind.color = ''
        const Button = h(BasicButton, btnBind, extendSlots(slots))

        // If it is not enabled, it is a normal button
        if (!props.enable) {
          return Button
        }
        return h(Popconfirm, bindValues, { default: () => Button })
      }
    },
  })
</script>
