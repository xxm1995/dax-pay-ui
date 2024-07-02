import { defineComponent, computed, unref } from 'vue'
import { BasicDrawer } from '@/components/Drawer'
import { Divider } from 'ant-design-vue'
import {
  TypePicker,
  ThemeColorPicker,
  SettingFooter,
  SwitchItem,
  SelectItem,
  InputNumberItem,
} from './components'

import { AppDarkModeToggle } from '@/components/Application'

import { MenuTypeEnum, TriggerEnum } from '@/enums/menuEnum'

import { useRootSetting } from '@/hooks/setting/useRootSetting'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting'
import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting'
import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting'

import { baseHandler } from './handler'

import {
  HandlerEnum,
  contentModeOptions,
  topMenuAlignOptions,
  getMenuTriggerOptions,
  routerTransitionOptions,
  menuTypeListEnum,
  mixSidebarTriggerOptions,
} from './enum'

// import {
//   HEADER_PRESET_BG_COLOR_LIST,
//   SIDE_BAR_BG_COLOR_LIST,
//   APP_PRESET_COLOR_LIST,
// } from '@/settings/designSetting';
import { SIDE_BAR_BG_COLOR_LIST } from '@/settings/designSetting'

export default defineComponent({
  name: 'SettingDrawer',
  setup(_, { attrs }) {
    const {
      getContentMode,
      getShowFooter,
      getShowBreadCrumb,
      getShowBreadCrumbIcon,
      getShowLogo,
      getFullContent,
      getColorWeak,
      getGrayMode,
      getShowDarkModeToggle,
      // getThemeColor,
    } = useRootSetting()

    const { getOpenPageLoading, getBasicTransition, getEnableTransition, getOpenNProgress } =
      useTransitionSetting()

    const {
      getIsHorizontal,
      getShowMenu,
      getMenuType,
      getTrigger,
      getCollapsedShowTitle,
      getMenuFixed,
      getCollapsed,
      getCanDrag,
      getTopMenuAlign,
      getAccordion,
      getMenuWidth,
      getMenuBgColor,
      getIsTopMenu,
      getSplit,
      getIsMixSidebar,
      getCloseMixSidebarOnChange,
      getMixSideTrigger,
      getMixSideFixed,
    } = useMenuSetting()

    const {
      getShowHeader,
      getFixed: getHeaderFixed,
      // getHeaderBgColor,
      getShowSearch,
    } = useHeaderSetting()

    const { getShowMultipleTab, getShowQuick, getShowRedo, getShowFold, getAutoCollapse } =
      useMultipleTabSetting()

    const getShowMenuRef = computed(() => {
      return unref(getShowMenu) && !unref(getIsHorizontal)
    })

    function renderSidebar() {
      return (
        <>
          <TypePicker
            menuTypeList={menuTypeListEnum}
            handler={(item: (typeof menuTypeListEnum)[0]) => {
              baseHandler(HandlerEnum.CHANGE_LAYOUT, {
                mode: item.mode,
                type: item.type,
                split: unref(getIsHorizontal) ? false : undefined,
              })
            }}
            def={unref(getMenuType)}
          />
        </>
      )
    }

    // function renderHeaderTheme() {
    //   return (
    //     <ThemeColorPicker
    //       colorList={HEADER_PRESET_BG_COLOR_LIST}
    //       def={unref(getHeaderBgColor)}
    //       event={HandlerEnum.HEADER_THEME}
    //     />
    //   );
    // }

    function renderSideBarTheme() {
      return (
        <ThemeColorPicker
          colorList={SIDE_BAR_BG_COLOR_LIST}
          def={unref(getMenuBgColor)}
          event={HandlerEnum.MENU_THEME}
        />
      )
    }

    // function renderMainTheme() {
    //   return (
    //     <ThemeColorPicker
    //       colorList={APP_PRESET_COLOR_LIST}
    //       def={unref(getThemeColor)}
    //       event={HandlerEnum.CHANGE_THEME_COLOR}
    //     />
    //   );
    // }

    /**
     * @description:
     */
    function renderFeatures() {
      let triggerDef = unref(getTrigger)

      const triggerOptions = getMenuTriggerOptions(unref(getSplit))
      const some = triggerOptions.some((item) => item.value === triggerDef)
      if (!some) {
        triggerDef = TriggerEnum.FOOTER
      }

      return (
        <>
          <SwitchItem
            title="分割菜单"
            event={HandlerEnum.MENU_SPLIT}
            def={unref(getSplit)}
            disabled={!unref(getShowMenuRef) || unref(getMenuType) !== MenuTypeEnum.MIX}
          />
          <SwitchItem
            title="固定展开菜单"
            event={HandlerEnum.MENU_FIXED_MIX_SIDEBAR}
            def={unref(getMixSideFixed)}
            disabled={!unref(getIsMixSidebar)}
          />

          <SwitchItem
            title="切换页面关闭菜单"
            event={HandlerEnum.MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE}
            def={unref(getCloseMixSidebarOnChange)}
            disabled={!unref(getIsMixSidebar)}
          />
          <SwitchItem
            title="折叠菜单"
            event={HandlerEnum.MENU_COLLAPSED}
            def={unref(getCollapsed)}
            disabled={!unref(getShowMenuRef)}
          />

          <SwitchItem
            title="侧边菜单拖拽"
            event={HandlerEnum.MENU_HAS_DRAG}
            def={unref(getCanDrag)}
            disabled={!unref(getShowMenuRef)}
          />
          <SwitchItem
            title="菜单搜索"
            event={HandlerEnum.HEADER_SEARCH}
            def={unref(getShowSearch)}
            disabled={!unref(getShowHeader)}
          />
          <SwitchItem
            title="侧边菜单手风琴模式"
            event={HandlerEnum.MENU_ACCORDION}
            def={unref(getAccordion)}
            disabled={!unref(getShowMenuRef)}
          />

          <SwitchItem
            title="折叠菜单显示名称"
            event={HandlerEnum.MENU_COLLAPSED_SHOW_TITLE}
            def={unref(getCollapsedShowTitle)}
            disabled={!unref(getShowMenuRef) || !unref(getCollapsed) || unref(getIsMixSidebar)}
          />

          <SwitchItem
            title="固定header"
            event={HandlerEnum.HEADER_FIXED}
            def={unref(getHeaderFixed)}
            disabled={!unref(getShowHeader)}
          />
          <SwitchItem
            title="固定Sidebar"
            event={HandlerEnum.MENU_FIXED}
            def={unref(getMenuFixed)}
            disabled={!unref(getShowMenuRef) || unref(getIsMixSidebar)}
          />
          <SwitchItem
            title="fold模式下自动收起标签页"
            event={HandlerEnum.TABS_AUTO_COLLAPSE}
            def={unref(getAutoCollapse)}
            disabled={!unref(getShowMultipleTab)}
          />
          <SelectItem
            title="混合菜单触发方式"
            event={HandlerEnum.MENU_TRIGGER_MIX_SIDEBAR}
            def={unref(getMixSideTrigger)}
            options={mixSidebarTriggerOptions}
            disabled={!unref(getIsMixSidebar)}
          />
          <SelectItem
            title="顶部菜单布局"
            event={HandlerEnum.MENU_TOP_ALIGN}
            def={unref(getTopMenuAlign)}
            options={topMenuAlignOptions}
            disabled={
              !unref(getShowHeader) ||
              unref(getSplit) ||
              (!unref(getIsTopMenu) && !unref(getSplit)) ||
              unref(getIsMixSidebar)
            }
          />
          <SelectItem
            title="菜单折叠按钮"
            event={HandlerEnum.MENU_TRIGGER}
            def={triggerDef}
            options={triggerOptions}
            disabled={!unref(getShowMenuRef) || unref(getIsMixSidebar)}
          />
          <SelectItem
            title="内容区域宽度"
            event={HandlerEnum.CONTENT_MODE}
            def={unref(getContentMode)}
            options={contentModeOptions}
          />
          <InputNumberItem
            title="菜单展开宽度"
            max={600}
            min={100}
            step={10}
            event={HandlerEnum.MENU_WIDTH}
            disabled={!unref(getShowMenuRef)}
            defaultValue={unref(getMenuWidth)}
            formatter={(value: string) => `${parseInt(value)}px`}
          />
        </>
      )
    }

    function renderContent() {
      return (
        <>
          <SwitchItem
            title="面包屑"
            event={HandlerEnum.SHOW_BREADCRUMB}
            def={unref(getShowBreadCrumb)}
            disabled={!unref(getShowHeader)}
          />

          <SwitchItem
            title="面包屑图标"
            event={HandlerEnum.SHOW_BREADCRUMB_ICON}
            def={unref(getShowBreadCrumbIcon)}
            disabled={!unref(getShowHeader)}
          />

          <SwitchItem
            title="标签页"
            event={HandlerEnum.TABS_SHOW}
            def={unref(getShowMultipleTab)}
          />

          <SwitchItem
            title="标签页刷新按钮"
            event={HandlerEnum.TABS_SHOW_REDO}
            def={unref(getShowRedo)}
            disabled={!unref(getShowMultipleTab)}
          />

          <SwitchItem
            title="标签页快捷按钮"
            event={HandlerEnum.TABS_SHOW_QUICK}
            def={unref(getShowQuick)}
            disabled={!unref(getShowMultipleTab)}
          />
          <SwitchItem
            title="标签页折叠按钮"
            event={HandlerEnum.TABS_SHOW_FOLD}
            def={unref(getShowFold)}
            disabled={!unref(getShowMultipleTab)}
          />

          <SwitchItem
            title="左侧菜单"
            event={HandlerEnum.MENU_SHOW_SIDEBAR}
            def={unref(getShowMenu)}
            disabled={unref(getIsHorizontal)}
          />

          <SwitchItem title="顶栏" event={HandlerEnum.HEADER_SHOW} def={unref(getShowHeader)} />
          <SwitchItem
            title="Logo"
            event={HandlerEnum.SHOW_LOGO}
            def={unref(getShowLogo)}
            disabled={unref(getIsMixSidebar)}
          />
          <SwitchItem title="页脚" event={HandlerEnum.SHOW_FOOTER} def={unref(getShowFooter)} />
          <SwitchItem
            title="全屏内容"
            event={HandlerEnum.FULL_CONTENT}
            def={unref(getFullContent)}
          />

          <SwitchItem title="灰色模式" event={HandlerEnum.GRAY_MODE} def={unref(getGrayMode)} />

          <SwitchItem title="色弱模式" event={HandlerEnum.COLOR_WEAK} def={unref(getColorWeak)} />
        </>
      )
    }

    function renderTransition() {
      return (
        <>
          <SwitchItem
            title="顶部进度条"
            event={HandlerEnum.OPEN_PROGRESS}
            def={unref(getOpenNProgress)}
          />
          <SwitchItem
            title="切换loading"
            event={HandlerEnum.OPEN_PAGE_LOADING}
            def={unref(getOpenPageLoading)}
          />

          <SwitchItem
            title="切换动画"
            event={HandlerEnum.OPEN_ROUTE_TRANSITION}
            def={unref(getEnableTransition)}
          />

          <SelectItem
            title="动画类型"
            event={HandlerEnum.ROUTER_TRANSITION}
            def={unref(getBasicTransition)}
            options={routerTransitionOptions}
            disabled={!unref(getEnableTransition)}
          />
        </>
      )
    }

    return () => (
      <BasicDrawer {...attrs} title="项目配置" width={330} class="setting-drawer">
        {unref(getShowDarkModeToggle) && <Divider>{() => '主题'}</Divider>}
        {unref(getShowDarkModeToggle) && <AppDarkModeToggle class="mx-auto" />}
        <Divider>导航栏模式</Divider>
        {renderSidebar()}
        <Divider>菜单主题</Divider>
        {renderSideBarTheme()}
        <Divider>界面功能</Divider>
        {renderFeatures()}
        <Divider>界面显示</Divider>
        {renderContent()}
        <Divider>动画</Divider>
        {renderTransition()}
        <Divider />
        <SettingFooter />
      </BasicDrawer>
    )
  },
})
