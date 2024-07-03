<template>
  <Layout.Footer :class="prefixCls" v-if="getShowLayoutFooter" ref="footerRef">
    <div>Copyright &copy;2021 济南易杯光年软件技术有限公司</div>
  </Layout.Footer>
</template>
<script lang="ts" setup>
  import { computed, unref, ref } from 'vue'
  import { Layout } from 'ant-design-vue'

  import { useRootSetting } from '@/hooks/setting/useRootSetting'
  import { useRouter } from 'vue-router'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useLayoutHeight } from '../content/useContentViewHeight'

  defineOptions({ name: 'LayoutFooter' })

  const { getShowFooter } = useRootSetting()
  const { currentRoute } = useRouter()
  const { prefixCls } = useDesign('layout-footer')

  const footerRef = ref<ComponentRef>(null)
  const { setFooterHeight } = useLayoutHeight()

  const getShowLayoutFooter = computed(() => {
    if (unref(getShowFooter)) {
      const footerEl = unref(footerRef)?.$el
      setFooterHeight(footerEl?.offsetHeight || 0)
    } else {
      setFooterHeight(0)
    }
    return unref(getShowFooter) && !unref(currentRoute).meta?.hiddenFooter
  })
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-layout-footer';

  @normal-color: rgba(0, 0, 0, 0.45);

  @hover-color: rgba(0, 0, 0, 0.85);

  .@{prefix-cls} {
    // 页脚固定高度
    height: 75px;
    color: @normal-color;
    text-align: center;

    &__links {
      margin-bottom: 8px;

      a {
        color: @normal-color;

        &:hover {
          color: @hover-color;
        }
      }
    }

    &__github {
      margin: 0 30px;

      &:hover {
        color: @hover-color;
      }
    }
  }
</style>
