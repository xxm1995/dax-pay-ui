<template>
  <div :class="prefixCls">
    <a-button type="primary" block @click="handleCopy">
      <CopyOutlined class="mr-2" />
      拷贝
    </a-button>

    <a-button color="warning" block @click="handleResetSetting" class="my-3">
      <RedoOutlined class="mr-2" />
      重置
    </a-button>

    <a-button color="error" block @click="handleClearAndRedo">
      <RedoOutlined class="mr-2" />
      清空缓存并返回登录页
    </a-button>
  </div>
</template>
<script lang="ts" setup>
  import { unref } from 'vue'

  import { CopyOutlined, RedoOutlined } from '@ant-design/icons-vue'

  import { useAppStore } from '@/store/modules/app'
  import { usePermissionStore } from '@/store/modules/permission'
  import { useMultipleTabStore } from '@/store/modules/multipleTab'
  import { useUserStore } from '@/store/modules/user'

  import { useDesign } from '@/hooks/web/useDesign'
  import { useMessage } from '@/hooks/web/useMessage'
  import { copyText } from '@/utils/copyTextToClipboard'
  import { updateColorWeak } from '@/logics/theme/updateColorWeak'
  import { updateGrayMode } from '@/logics/theme/updateGrayMode'
  import defaultSetting from '@/settings/projectSetting'
  import { updateSidebarBgColor } from '@/logics/theme/updateBackground'

  defineOptions({ name: 'SettingFooter' })

  const permissionStore = usePermissionStore()
  const { prefixCls } = useDesign('setting-footer')
  const { createSuccessModal, createMessage } = useMessage()
  const tabStore = useMultipleTabStore()
  const userStore = useUserStore()
  const appStore = useAppStore()

  function handleCopy() {
    copyText(JSON.stringify(unref(appStore.getProjectConfig), null, 2), null).then(() => {
      createSuccessModal({
        title: '操作成功',
        content: '复制成功,请到 src/settings/projectSetting.ts 中修改配置！',
      })
    })
  }

  function handleResetSetting() {
    try {
      appStore.setProjectConfig(defaultSetting)
      const { colorWeak, grayMode } = defaultSetting
      updateSidebarBgColor()
      updateColorWeak(colorWeak)
      updateGrayMode(grayMode)
      createMessage.success('重置成功')
    } catch (error: any) {
      createMessage.error(error)
    }
  }

  function handleClearAndRedo() {
    localStorage.clear()
    appStore.resetAllState()
    permissionStore.resetState()
    tabStore.resetState()
    userStore.resetState()
    location.reload()
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-setting-footer';

  .@{prefix-cls} {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
