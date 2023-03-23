import Modeler from 'bpmn-js/lib/Modeler'
import { $ref } from '@vue-macros/reactivity-transform/macros'
import customTranslate from '/@/components/Bpmn/common/customTranslate'
import { nextTick } from 'vue'
import { getInitBpmnData } from '/@/components/Bpmn/flowable/designData'
import { useMessage } from '/@/hooks/web/useMessage'
import { $$ } from 'vue/macros'

export default function <T>(canvas: string, emit: any) {
  const { createConfirm } = useMessage()

  let isEdit = $ref<boolean>(false)
  let isView = $ref<boolean>(true)

  // 实例
  let modeler: Modeler

  // xml代码预览
  let codeVisible = $ref(false)
  let xmlCode = $ref('')

  // 缩放
  let zoom = $ref(1)
  // 编辑时参数
  const isEditModules = [
    {
      translate: ['value', customTranslate], // 翻译
    },
  ]
  // 查看时参数
  const notEditModules = [
    {
      translate: ['value', customTranslate], // 翻译
      paletteProvider: ['value', ''], // 禁用/清空左侧工具栏
      labelEditingProvider: ['value', ''], // 禁用节点编辑
      contextPadProvider: ['value', ''], // 禁用图形菜单
      bendpoints: ['value', {}], // 禁用连线拖动
      move: ['value', ''], // 禁用单个图形拖动
    },
  ]

  /**
   * 渲染函数
   */
  async function renderer(xml: string, edit: boolean, view: boolean) {
    nextTick(() => console.log(9999))
    isEdit = edit
    isView = view
    const xmlData = xml || getInitBpmnData()
    const additionalModule = edit && !view ? isEditModules : notEditModules
    modeler = new Modeler({
      container: canvas,
      propertiesPanel: {},
      additionalModules: additionalModule,
      moddleExtensions: {},
    })
    await createNewDiagram(xmlData)
  }

  /**
   * 获取流程元素
   */
  function getProcessElement() {
    const rootElements = modeler.getDefinitions().rootElements
    for (let i = 0; i < rootElements.length; i++) {
      if (rootElements[i].$type === 'bpmn:Process') return rootElements[i]
    }
  }

  /**
   * 撤消
   */
  function undo() {
    modeler.get('commandStack').undo()
  }
  /**
   * 重做
   */
  function redo() {
    modeler.get('commandStack').redo()
  }

  /**
   * 查看 bpmn.xml
   */
  async function showXML() {
    xmlCode = await downXML(false)
    codeVisible = true
  }
  /**
   * 保存
   */
  async function saveXML() {
    const xml = await downXML()
    emit('save', xml)
  }
  /**
   * 下载 bpmn.xml
   */
  async function downXML(download = false) {
    try {
      const { xml } = await modeler.saveXML({ format: true })
      if (download) {
        downloadFile(`${getProcessElement().name}.bpmn20.xml`, xml, 'application/xml')
      }
      return xml
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * 下载图片
   */
  async function downImg(type = 'svg', download = false) {
    try {
      const { svg } = await modeler.saveSVG({ format: true })
      if (download) {
        downloadFile(getProcessElement().name, svg, 'image/svg+xml')
      }
      return svg
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * 打开 bpmn.xml 文件
   */
  function openBpmn(file) {
    const reader = new FileReader()
    reader.readAsText(file, 'utf-8')
    reader.onload = () => {
      createNewDiagram(reader.result)
    }
    return false
  }
  /**
   * 下载文件
   */
  function downloadFile(filename, data, type) {
    const a = document.createElement('a')
    const url = window.URL.createObjectURL(new Blob([data], { type: type }))
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  /**
   * 关闭
   */
  function cancel() {
    emit('cancel')
  }
  /**
   * 新建画布
   */
  function newDiagram() {
    createNewDiagram(getInitBpmnData())
  }
  /**
   * 让图能自适应屏幕
   */
  function fitViewport() {
    zoom = modeler.get('canvas').zoom('fit-viewport', 'auto')
  }
  /**
   * 放大缩小
   */
  function zoomViewport(zoomIn = true) {
    zoom = modeler.get('canvas').zoom()
    zoom += zoomIn ? 0.1 : -0.1
    modeler.get('canvas').zoom(zoom)
  }
  /**
   * 创建新画布
   */
  async function createNewDiagram(data) {
    // 将字符串转换成图显示出来
    data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
      return str.replace(/</g, '&lt;')
    })
    await modeler.importXML(data)
    fitViewport()
  }
  /**
   * 清除画布
   */
  function clearDiagram() {
    createConfirm({
      iconType: 'info',
      title: '警告',
      content: '是否要清空画布!',
      onOk: () => {
        newDiagram()
      },
    })
  }
  return {
    modeler: $$(modeler),
    isEdit: $$(isEdit),
    isView: $$(isView),
    codeVisible: $$(codeVisible),
    xmlCode: $$(xmlCode),
    zoom: $$(zoom),
    renderer,
    getProcessElement,
    undo,
    redo,
    showXML,
    saveXML,
    downXML,
    downImg,
    openBpmn,
    downloadFile,
    cancel,
    newDiagram,
    fitViewport,
    zoomViewport,
    createNewDiagram,
    clearDiagram,
  }
}
