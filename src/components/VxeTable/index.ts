import { App } from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
// import 'vxe-table/styles/index.scss'
import './black.scss'

/**
 * 加载vxe-table
 * @param app
 */
export function useTable(app: App) {
  app.use(VXETable)
}

/**
 * 配置
 */
VXETable.setup({
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
    size: null,
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
