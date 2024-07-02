<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name`" class="truncate">
          {{ getUserInfo.name }}
        </span>
      </span>
    </span>

    <template #overlay>
      <a-menu @click="handleMenuClick">
        <MenuItem key="doc" text="文档" icon="ion:document-text-outline" v-if="getShowDoc" />
        <Menu.Divider v-if="getShowDoc" />
        <MenuItem key="logout" text="退出" icon="ion:power-outline" />
      </a-menu>
    </template>
  </Dropdown>
</template>
<script lang="ts" setup>
  import { Dropdown, Menu } from 'ant-design-vue'
  import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface'
  import { computed } from 'vue'
  import { DOC_URL } from '@/settings/siteSetting'
  import { useUserStore } from '@/store/modules/user'
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting'
  import { useDesign } from '@/hooks/web/useDesign'
  import headerImg from '@/assets/images/header.jpg'
  import { propTypes } from '@/utils/propTypes'
  import { openWindow } from '@/utils'
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent'

  type MenuEvent = 'logout' | 'doc' | 'lock' | 'api'

  const MenuItem = createAsyncComponent(() => import('./DropMenuItem.vue'))

  defineOptions({ name: 'UserDropdown' })

  defineProps({
    theme: propTypes.oneOf(['dark', 'light']),
  })

  const { prefixCls } = useDesign('header-user-dropdown')
  const { getShowDoc } = useHeaderSetting()
  const userStore = useUserStore()

  const getUserInfo = computed(() => {
    const { name = '', avatar } = userStore.getUserInfo || {}
    return { name, avatar: avatar || headerImg }
  })

  //  login out
  function handleLoginOut() {
    userStore.confirmLoginOut()
  }

  // open doc
  function openDoc() {
    openWindow(DOC_URL)
  }

  function handleMenuClick(e: MenuInfo) {
    switch (e.key as MenuEvent) {
      case 'logout':
        handleLoginOut()
        break
      case 'doc':
        openDoc()
        break
    }
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
