import type { AppRouteRecordRaw, Menu } from '/@/router/types'

import { defineStore } from 'pinia'
import { store } from '/@/store'
import { flatMultiLevelRoutes, transformObjToRoute } from '/@/router/helper/routeHelper'
import { transformRouteToMenu } from '/@/router/helper/menuHelper'

import { DASHBOARD, ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic'

import { filter } from '/@/utils/helper/treeHelper'

import { getPermissions } from '/@/api/sys/menu'

import { useMessage } from '/@/hooks/web/useMessage'
import { PageEnum } from '/@/enums/pageEnum'
import { getAppEnvConfig } from '/@/utils/env'
import { PermMenu } from '/@/api/sys/model/menuModel'
import { PROJECT_BASE } from '/@/router/routes/project'

interface PermissionState {
  // 权限代码列表
  permCodeList: string[] | number[]
  // 路由是否动态添加
  isDynamicAddedRoute: boolean
  // 触发菜单更新
  lastBuildMenuTime: number
  // 后台菜单列表
  backMenuList: Menu[]
  // 菜单列表
  frontMenuList: Menu[]
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    // 权限代码列表
    permCodeList: [],
    // 路由是否动态添加
    isDynamicAddedRoute: false,
    // 触发菜单更新
    lastBuildMenuTime: 0,
    // 后台菜单列表
    backMenuList: [],
    // 菜单列表
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list
      list?.length > 0 && this.setLastBuildMenuTime()
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime()
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added
    },
    resetState(): void {
      this.isDynamicAddedRoute = false
      this.permCodeList = []
      this.backMenuList = []
      this.lastBuildMenuTime = 0
    },
    /**
     * 权限码和菜单更新, 更新权限码并返回菜单信息
     */
    async changeMenuAndPermCode(): Promise<PermMenu[]> {
      const { VITE_GLOB_APP_CLIENT } = getAppEnvConfig()
      const {
        data: { menus, resourcePerms },
      } = await getPermissions(VITE_GLOB_APP_CLIENT as string)
      this.setPermCodeList(resourcePerms)
      return menus
    },

    /**
     * 转换路由为系统中的菜单
     */
    convertMenus(permMenus: PermMenu[]): AppRouteRecordRaw[] {
      return (
        permMenus?.map((o) => {
          return {
            name: o.name,
            path: o.path,
            component: o.component,
            targetOutside: o.targetOutside,
            iframeUrl: o.iframeUrl,
            redirect: o.redirect,
            meta: {
              orderNo: o.sortNo,
              title: o.title,
              icon: o.icon,
              hideMenu: o.hidden,
              hideChildrenInMenu: o.hideChildrenInMenu,
              ignoreKeepAlive: !o.keepAlive,
            },
            children: this.convertMenus(o.children),
          } as AppRouteRecordRaw
        }) || []
      )
    },

    /**
     * 构建路由  后端控制
     */
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      // 路由
      let routes: AppRouteRecordRaw[] = []
      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route
        // ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
        const { ignoreRoute } = meta || {}
        // arr.filter 返回 true 表示该元素通过测试
        return !ignoreRoute
      }

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return
        // 主页路径
        let homePath: string = PageEnum.BASE_HOME

        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/'
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route
            const currentPath = path.startsWith('/') ? path : parentPath + path
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true })
                throw new Error('end')
              }
            }
            children && children.length > 0 && patcher(children, currentPath)
          })
        }

        try {
          patcher(routes)
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return
      }

      const { createMessage } = useMessage()

      createMessage.loading({
        content: '菜单加载中...',
        duration: 1,
      })

      let routeList: AppRouteRecordRaw[] = []

      // 获取后台的菜单和更新权限码
      try {
        const permMenus = await this.changeMenuAndPermCode()
        // 将 后端获取的菜单转换为系统中的菜单格式
        routeList = this.convertMenus(permMenus)
      } catch (error) {
        console.error(error)
      }
      // 后端获取的菜单如果为空, 不进行处理
      if (routeList) {
        routeList = transformObjToRoute(routeList)
        //  后台路由到菜单结构
        const backMenuList = transformRouteToMenu(routeList)
        this.setBackMenuList(backMenuList)
        // 删除 meta.ignoreRoute 项
        routeList = filter(routeList, routeRemoveIgnoreFilter)
        routeList = routeList.filter(routeRemoveIgnoreFilter)

        routeList = flatMultiLevelRoutes(routeList)
      }

      routes = [PAGE_NOT_FOUND_ROUTE, ...routeList]

      // 添加更多配置的路由菜单
      routes.push(ERROR_LOG_ROUTE)
      routes.push(DASHBOARD)
      routes.push(...PROJECT_BASE)
      patchHomeAffix(routes)
      return routes
    },
  },
})

// 在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store)
}
