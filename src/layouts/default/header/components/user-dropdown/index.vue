<template>
  <dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.name }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <dropdown-menu-item key="setting" text="个人设置" icon="ant-design:setting-outlined" />
        <dropdown-menu-item v-if="getUseLockPage" key="lock" text="锁定屏幕" icon="ion:lock-closed-outline" />
        <dropdown-menu-item key="logout" text="退出系统" icon="ion:power-outline" />
      </Menu>
    </template>
  </dropdown>
  <lock-modal @register="register" />
</template>
<script lang="ts" setup>
  import { Dropdown, Menu } from 'ant-design-vue'
  import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface'

  import { computed } from 'vue'

  import { useUserStore } from '/@/store/modules/user'
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useModal } from '/@/components/Modal'

  import headerImg from '/@/assets/images/header.jpg'
  import { propTypes } from '/@/utils/propTypes'

  import { router } from '/@/router'
  import { PageEnum } from '/@/enums/pageEnum'
  import DropdownMenuItem from '/@/layouts/default/header/components/user-dropdown/DropMenuItem.vue'
  import LockModal from '/@/layouts/default/header/components/lock/LockModal.vue'

  defineProps({
    theme: propTypes.oneOf(['dark', 'light']),
  })

  type MenuEvent = 'logout' | 'lock' | 'setting'

  const { prefixCls } = useDesign('header-user-dropdown')
  const { getUseLockPage } = useHeaderSetting()
  const userStore = useUserStore()

  // 用户信息
  const getUserInfo = computed(() => {
    const { name = '', avatar } = userStore.getUserInfo || {}
    return { name, avatar: avatar || headerImg }
  })

  const [register, { openModal }] = useModal()

  // 锁定屏幕
  function handleLock() {
    openModal(true)
  }

  // 设置界面
  function setting() {
    router.push(PageEnum.ACCOUNT_SETTING)
  }

  //  退出
  function handleLoginOut() {
    userStore.confirmLoginOut()
  }

  function handleMenuClick(e: MenuInfo) {
    switch (e.key as MenuEvent) {
      case 'logout':
        handleLoginOut()
        break
      case 'lock':
        handleLock()
        break
      case 'setting':
        setting()
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
