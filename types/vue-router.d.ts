export {}

declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    orderNo?: number
    // 标题
    title: string
    // 动态路由器级别。
    dynamicLevel?: number
    // 动态路由器真实路由路径 (用于性能)。
    realPath?: string
    // 是否忽略鉴权
    ignoreAuth?: boolean
    // 角色
    roles?: RoleEnum[]
    // 是否不缓存
    ignoreKeepAlive?: boolean
    // 它固定在tab上吗
    affix?: boolean
    // 图标
    icon?: string
    // Iframe 打开的连接
    frameSrc?: string
    // current page transition 当前页面转换
    transitionName?: string
    // 路由是否已动态添加 Whether the route has been dynamically added
    hideBreadcrumb?: boolean
    // 隐藏子菜单 Hide submenu
    hideChildrenInMenu?: boolean
    // 携带参数 Carrying parameters
    carryParam?: boolean
    // 内部用于标记单层菜单 Used internally to mark single-level menus
    single?: boolean
    // Currently active menu
    currentActiveMenu?: string
    // Never show in tab
    hideTab?: boolean
    // Never show in menu
    hideMenu?: boolean
    isLink?: boolean
    // only build for Menu
    ignoreRoute?: boolean
    // Hide path for children
    hidePathForChildren?: boolean
  }
}
