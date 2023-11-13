import type { ProjectConfig } from '/#/config'
import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '/@/enums/menuEnum'
import { CacheTypeEnum } from '/@/enums/cacheEnum'
import {
  ContentEnum,
  PermissionModeEnum,
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
  SessionTimeoutProcessingEnum,
} from '/@/enums/appEnum'
import { SIDE_BAR_BG_COLOR_LIST, HEADER_PRESET_BG_COLOR_LIST } from './designSetting'
import { primaryColor } from '../../build/config/themeConfig'

// ! 更改后需要清除浏览器缓存
const setting: ProjectConfig = {
  // 是否显示配置按钮
  showSettingButton: true,

  // 是否显示主题切换按钮
  showDarkModeToggle: true,

  // `Settings` 按钮位置
  settingButtonPosition: SettingButtonPositionEnum.AUTO,

  // 权限模式
  permissionMode: PermissionModeEnum.BACK,

  // 权限相关缓存存储在sessionStorage或localStorage中
  permissionCacheType: CacheTypeEnum.LOCAL,

  // 会话超时处理
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,

  // 颜色
  themeColor: primaryColor,

  // 灰度迷失
  grayMode: false,

  // 色弱模式
  colorWeak: false,

  // 是否取消菜单，顶部，多选项卡页面显示，对于可能嵌入其他系统
  fullContent: false,

  // 内容模式
  contentMode: ContentEnum.FULL,

  // 是否显示Logo
  showLogo: true,

  // 是否显示页脚
  showFooter: false,

  // 页头设置
  headerSetting: {
    // 背景颜色
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
    // 固定在顶部
    fixed: true,
    // 是否显示
    show: true,
    // 主题
    theme: ThemeEnum.LIGHT,
    // 是否启用锁屏功能
    useLockPage: true,
    // 是否显示全屏按钮
    showFullScreen: true,
    // 是否显示文档按钮
    showDoc: true,
    // 是否显示通知按钮
    showNotice: true,
    // 是否显示搜索按钮
    showSearch: true,
  },

  // 菜单配置
  menuSetting: {
    // 背景颜色
    bgColor: SIDE_BAR_BG_COLOR_LIST[0],
    // 是否固定
    fixed: true,
    // Menu collapse
    collapsed: false,
    // 当sider因为响应式布局而隐藏时
    siderHidden: false,
    // 折叠菜单时是否显示菜单名称
    collapsedShowTitle: false,
    // 是否可以拖动仅限于左侧菜单的打开，鼠标在菜单的右侧有一个拖动条
    canDrag: false,
    // Whether to show no dom 是否不显示dom
    show: true,
    // Whether to show dom 是否隐藏
    hidden: false,
    // Menu width 宽度
    menuWidth: 210,
    // Menu mode 模式
    mode: MenuModeEnum.INLINE,
    // Menu 类型
    type: MenuTypeEnum.SIDEBAR,
    // Menu 主题
    theme: ThemeEnum.DARK,
    // Split menu
    split: false,
    // Top menu layout
    topMenuAlign: 'center',
    // Fold trigger position
    trigger: TriggerEnum.HEADER,
    // Turn on accordion mode, only show a menu
    accordion: true,
    // Switch page to close menu
    closeMixSidebarOnChange: false,
    // Module opening method ‘click’ |'hover'
    mixSideTrigger: MixSidebarTriggerEnum.CLICK,
    // Fixed expanded menu
    mixSideFixed: false,
  },

  // 多标签配置
  multiTabsSetting: {
    // 缓存 自动还原原来已打开的标签
    cache: false,
    // Turn on
    show: true,
    // 是否可以拖放排序标签
    canDrag: true,
    // Turn on quick actions
    showQuick: true,
    // Whether to show the refresh button
    showRedo: true,
    // Whether to show the collapse button
    showFold: true,
  },

  // Transition Setting
  transitionSetting: {
    //  Whether to open the page switching animation
    // The disabled state will also disable pageLoading
    enable: true,

    // Route basic switching animation
    basicTransition: RouterTransitionEnum.FADE_SIDE,

    // Whether to open page switching loading
    // Only open when enable=true
    openPageLoading: true,

    // Whether to open the top progress bar
    openNProgress: false,
  },

  // Whether to enable KeepAlive cache is best to close during development, otherwise the cache needs to be cleared every time
  openKeepAlive: true,

  // Automatic screen lock time, 0 does not lock the screen. Unit minute default 0
  lockTime: 0,

  // Whether to show breadcrumbs
  showBreadCrumb: true,

  // Whether to show the breadcrumb icon
  showBreadCrumbIcon: false,

  // Use error-handler-plugin
  useErrorHandle: false,

  // 是否打开返回顶部
  useOpenBackTop: true,

  //  是否可以嵌入 iframe 页面
  canEmbedIFramePage: true,

  // 切换接口时是否删除未关闭的消息并通知
  closeMessageOnSwitch: false,

  // 如果启用，我想覆盖单个接口。可以在单独的界面中设置
  removeAllHttpPending: false,
}

export default setting
