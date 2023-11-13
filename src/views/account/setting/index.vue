<template>
  <ScrollContainer>
    <div ref="wrapperRef" :class="prefixCls">
      <a-tabs tab-position="left" :active-key="activeKey" @change="(o) => (activeKey = o)" :tabBarStyle="tabBarStyle">
        <template v-for="item in settingList" :key="item.key">
          <a-tab-pane :tab="item.name">
            <component :is="item.component" />
          </a-tab-pane>
        </template>
      </a-tabs>
    </div>
  </ScrollContainer>
</template>

<script lang="ts" setup>
  import { ScrollContainer } from '/@/components/Container'
  import { settingList } from './data'
  import { $ref } from 'vue/macros'
  import { useRoute } from 'vue-router'

  const prefixCls = 'account-setting'
  const tabBarStyle = {
    width: '220px',
  }
  const route = useRoute()
  let activeKey = $ref(route?.query?.activeKey || '1')
</script>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'AccountSettingPage',
  })
</script>
<style lang="less">
  .account-setting {
    margin: 12px;
    background-color: @component-background;

    .base-title {
      padding-left: 0;
    }

    .ant-tabs-tab-active {
      background-color: @item-active-bg;
    }
  }
</style>
