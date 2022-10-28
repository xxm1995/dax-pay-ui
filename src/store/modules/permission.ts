import type { AppRouteRecordRaw, Menu } from '/@/router/types'

import { defineStore } from 'pinia'
import { store } from '/@/store'
import { useUserStore } from './user'
import { useAppStoreWithOut } from './app'
import { toRaw } from 'vue'
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper'
import { transformRouteToMenu } from '/@/router/helper/menuHelper'

import projectSetting from '/@/settings/projectSetting'

import { PermissionModeEnum } from '/@/enums/appEnum'

import {
  DASHBOARD,
  ERROR_LOG_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
  PROJECT_BASE
} from "/@/router/routes/basic";

import { filter } from '/@/utils/helper/treeHelper'

import { getPermissions } from '/@/api/sys/menu'

import { useMessage } from '/@/hooks/web/useMessage'
import { PageEnum } from '/@/enums/pageEnum'
import { getAppEnvConfig } from '/@/utils/env'
import { PermMenu } from '/@/api/sys/model/menuModel'

interface PermissionState {
  // Permission code list
  // 权限代码列表
  permCodeList: string[] | number[]
  // Whether the route has been dynamically added
  // 路由是否动态添加
  isDynamicAddedRoute: boolean
  // To trigger a menu update
  // 触发菜单更新
  lastBuildMenuTime: number
  // Backstage menu list
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
    // Whether the route has been dynamically added
    // 路由是否动态添加
    isDynamicAddedRoute: false,
    // To trigger a menu update
    // 触发菜单更新
    lastBuildMenuTime: 0,
    // Backstage menu list
    // 后台菜单列表
    backMenuList: [],
    // menu List
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
     * 权限码和菜单更新
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
     * 转换权限菜单为系统中的菜单
     */
    convertMenus(permMenus: PermMenu[]): AppRouteRecordRaw[] {
      return permMenus?.map((o) => {
        const menu = {
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
        if (o.component.toUpperCase()) {
        }
        return menu
      })
    },

    /**
     * 构建路由
     */
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const userStore = useUserStore()
      const appStore = useAppStoreWithOut()

      let routes: AppRouteRecordRaw[] = []
      const roleList = toRaw(userStore.getRoleList) || []
      const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig

      // 路由过滤器 在 函数filter 作为回调传入遍历使用 (无用了)
      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route
        // 抽出角色
        const { roles } = meta || {}
        if (!roles) return true
        // 进行角色权限判断
        return roleList.some((role) => roles.includes(role))
      }

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
        // let homePath: string = userStore.getUserInfo.homePath || PageEnum.BASE_HOME
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

      switch (permissionMode) {
        // 后端控制 现在在用的方案
        case PermissionModeEnum.BACK:
          const { createMessage } = useMessage()

          createMessage.loading({
            content: '菜单加载中...',
            duration: 1,
          })

          let routeList: AppRouteRecordRaw[] = []

          // 获取菜单和权限码
          try {
            const permMenus = await this.changeMenuAndPermCode()
            // 将 后端获取的菜单转换为系统中的菜单格式
            routeList = this.convertMenus(permMenus)
          } catch (error) {
            console.error(error)
          }

          // 动态引入组件
          routeList = transformObjToRoute(routeList)
          //  后台路由到菜单结构
          const backMenuList = transformRouteToMenu(routeList)
          this.setBackMenuList(backMenuList)
          // 删除 meta.ignoreRoute 项
          routeList = filter(routeList, routeRemoveIgnoreFilter)
          routeList = routeList.filter(routeRemoveIgnoreFilter)

          routeList = flatMultiLevelRoutes(routeList)
          routes = [PAGE_NOT_FOUND_ROUTE, ...routeList]
          break
      }

      routes.push(ERROR_LOG_ROUTE)
      routes.push(DASHBOARD)
      routes.push(PROJECT_BASE)
      patchHomeAffix(routes)
      return routes
    },
  },
})

// Need to be used outside the setup
// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store)
}
