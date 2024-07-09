import { App } from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

/**
 * 加载vxe-table
 * @param app
 */
export function useTable(app: App) {
  app.use(VXETable).use(VxeUI)
}

/**
 * 是否设置暗黑模式
 * @param dark
 */
export function setDark(dark: boolean) {
  if (dark) {
    VXETable.setTheme('dark')
    VxeUI.setTheme('dark')
  } else {
    VXETable.setTheme('light')
    VxeUI.setTheme('light')
  }
}

/**
 * 配置
 */
VXETable.setConfig({
  // 表格配置
  table: {
    resizable: true,
    border: true,
    stripe: true,
    showOverflow: true,
    showHeaderOverflow: true,
    size: 'medium',
    tooltipConfig: {
      enterable: true,
    },
  },
  // 工具条配置
  toolbar: {
    custom: true,
    buttons: [],
    tools: [],
  },
  // 分页配置
  pager: {
    border: true,
    size: 'medium',
  },
})
