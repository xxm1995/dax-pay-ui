// 不可以全局引入k-designer样式, 否则与Vben脚手架样式冲突
import { pluginManager, setupAntd } from 'epic-designer'
export function registerEpicDesigner() {
  setupAntd(pluginManager)
}
