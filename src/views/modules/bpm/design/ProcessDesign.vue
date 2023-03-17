<template>
  <div class="flow-containers" style="height: 100%" :class="{ 'view-mode': isView }">
    <a-layout style="height: 100%">
      <a-layout-header theme="light" style="border-bottom: 1px solid rgb(218 218 218); height: auto; background-color: #fff">
        <div v-if="isView" style="display: flex; padding: 5px 0px; justify-content: space-between">
          <a-space>
            <a-upload v-if="isEdit" name="file" action="" accept=".bpmn,.xml" :showUploadList="false" :beforeUpload="openBpmn">
              <a-tooltip effect="dark" title="打开" placement="bottom">
                <a-button>
                  <Icon icon="ant-design:folder-open-outlined" />
                </a-button>
              </a-tooltip>
            </a-upload>
            <a-tooltip v-if="isEdit" effect="dark" title="清空" placement="bottom">
              <a-button @click="clearDiagram">
                <Icon icon="ant-design:delete-outlined" />
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="自适应屏幕" placement="bottom">
              <a-button @click="fitViewport">
                <Icon icon="ant-design:eye-outlined" />
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="放大" placement="bottom">
              <a-button @click="zoomViewport(true)">
                <Icon icon="ant-design:zoom-in-outlined" />
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="缩小" placement="bottom">
              <a-button @click="zoomViewport(false)">
                <Icon icon="ant-design:zoom-out-outlined" />
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="撤销(增删操作有效)" placement="bottom">
              <a-button @click="undo">
                <Icon icon="ant-design:undo-outlined" />
              </a-button>
            </a-tooltip>
            <a-tooltip title="重做(增删操作有效)" placement="bottom">
              <a-button @click="redo">
                <Icon icon="ant-design:redo-outlined" />
              </a-button>
            </a-tooltip>
            <slot name="header-left"></slot>
          </a-space>
          <a-space>
            <slot name="header-right"></slot>
            <a-button @click="showXML" preIcon="ant-design:eye-outlined"> XML </a-button>
            <a-button @click="downXML(true)" preIcon="ant-design:download-outlined">XML </a-button>
            <a-button @click="downImg('svg', true)" preIcon="ant-design:download-outlined"> SVG </a-button>
            <a-button type="primary" @click="saveXML" v-if="isEdit" preIcon="ant-design:cloud-upload-outlined"> 保存 </a-button>
            <a-button type="danger" @click="cancel" preIcon="ant-design:close-outlined"> 关闭 </a-button>
          </a-space>
        </div>
      </a-layout-header>
      <a-layout style="align-items: stretch">
        <a-layout-content style="padding: 0; margin-top: 10px">
          <div id="canvas" ref="canvas" class="canvas"></div>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <!--  xml预览  -->
    <basic-modal v-bind="$attrs" width="60%" title="XML" :visible="codeVisible" @cancel="codeVisible = false">
      <div>
        <code-editor readonly v-model:value="xmlCode" :mode="MODE.XML" />
      </div>
      <template #footer> </template>
    </basic-modal>
  </div>
</template>

<script lang="ts" setup>
  import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

  import Modeler from 'bpmn-js/lib/Modeler'

  import { nextTick, onMounted, watch, watchEffect } from 'vue'
  import customTranslate from '/@/components/Bpmn/common/customTranslate'
  import { $ref } from 'vue/macros'
  import Icon from '/@/components/Icon'
  import BpmData from '/@/components/Bpmn/BpmData'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { getInitBpmnData } from '/@/components/Bpmn/flowable/designData'
  import CodeEditor from '/@/components/CodeEditor/src/CodeEditor.vue'
  import { MODE } from '/@/components/CodeEditor'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'

  const emit = defineEmits(['save', 'cancel'])
  const { createConfirm } = useMessage()

  interface Props {
    // 是否编辑状态
    isEdit?: boolean
    // 是否预览状态
    isView?: boolean
    // bpmn 文件内容
    xml?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    isEdit: true,
    isView: false,
    xml: '',
  })

  watch(props, () => {
    init()
  })

  // 实例
  let modeler
  let canvas = $ref<any>()
  // 工具配置栏
  let paletteToolShow = $ref(true)
  // xml代码预览
  let codeVisible = $ref(false)
  let xmlCode = $ref('')
  // let paletteFilters = $ref<any>([])

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
   * 初始化
   */
  function init() {
    nextTick(async () => {
      const xml = props.xml || getInitBpmnData()
      const additionalModule = props.isEdit && !props.isView ? isEditModules : notEditModules
      console.log(props.isEdit, props.isView)
      modeler = new Modeler({
        container: '#canvas',
        propertiesPanel: {},
        additionalModules: additionalModule,
        moddleExtensions: {},
      })
      await createNewDiagram(xml)
    })
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
   * 保存
   */
  async function saveXML() {
    const xml = await downXML()
    emit('save', xml)
  }

  /**
   * 关闭
   */
  function cancel() {
    emit('cancel')
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
   * 新建画布
   */
  function newDiagram() {
    createNewDiagram(getInitBpmnData())
  }
  /**
   * 让图能自适应屏幕
   */
  function fitViewport() {
    zoom = modeler.get('canvas').zoom('fit-viewport')
    // @ts-ignore
    const bbox = document.querySelector('.flow-containers .viewport').getBBox()
    const currentViewBox = modeler.get('canvas').viewbox()
    const elementMid = {
      x: bbox.x + bbox.width / 2 - 65,
      y: bbox.y + bbox.height / 2,
    }
    modeler.get('canvas').viewbox({
      x: elementMid.x - currentViewBox.width / 2,
      y: elementMid.y - currentViewBox.height / 2,
      width: currentViewBox.width,
      height: currentViewBox.height,
    })
    zoom = (bbox.width / currentViewBox.width) * 1.8
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
   * 调整左侧工具栏排版
   */
  function adjustPalette() {
    try {
      // 获取 bpmn 设计器实例
      const djsPalette = canvas.children[0].children[1].children[4]
      if (!djsPalette) {
        return
      }
      const djsPalStyle = {
        width: '130px',
        padding: '5px',
        background: 'white',
        left: '20px',
        borderRadius: 0,
      }
      for (let key in djsPalStyle) {
        djsPalette.style[key] = djsPalStyle[key]
      }
      const palette = djsPalette.children[0]
      const allGroups = palette.children
      // 是否隐藏工具栏
      if (!paletteToolShow) {
        allGroups[0].style['display'] = 'none'
      }

      // 修改控件样式
      for (const gKey in allGroups) {
        const group = allGroups[gKey]
        for (const cKey in group.children) {
          const control = group.children[cKey]
          const controlStyle = {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            padding: '5px',
          }
          if (control.className && control.dataset && control.className.indexOf('entry') !== -1) {
            const controlProps = new BpmData().getControl(control.dataset.action)
            control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;'>${controlProps['title']}</div>`
            for (let csKey in controlStyle) {
              control.style[csKey] = controlStyle[csKey]
            }

            // 过滤扩展栏
            // if (paletteFilters.indexOf(control.dataset.action) !== -1) {
            //   control.style['display'] = 'none'
            //   continue
            // }
          }
        }
      }
    } catch (e) {
      console.error(e)
    }
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
    await adjustPalette()
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
</script>

<style lang="less" scoped>
  .canvas {
    width: 100%;
    height: 100%;
  }
  .view-mode {
    .ant-layout-header,
    .ant-layout-sider,
    :deep(.djs-palette),
    :deep(.bjs-powered-by) {
      display: none;
    }
  }

  html,
  body,
  #app {
    height: 100%;
  }

  .flow-containers {
    // background-color: #ffffff;
    width: 100%;
    height: 100%;
    .canvas {
      width: 100%;
      height: 100%;
    }
    .panel {
      position: absolute;
      right: 0;
      top: 50px;
      //width: 400px;
    }
    .load {
      margin-right: 10px;
    }

    .djs-palette {
      left: 0 !important;
      top: 0;
      border-top: none;
    }

    .djs-container svg {
      min-height: 650px;
    }
  }
  :deep(.ant-layout-sider:hover) {
    background: #0a97ce25 !important;
  }

  :deep(.ant-layout-sider) {
    z-index: 2;
  }

  :deep(.CodeMirror) {
    border: 1px solid #eee;
  }

  :deep(.djs-container) {
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+)
      repeat !important;
  }
</style>
