<template>
  <div class="flow-containers view-mode" style="height: 100%">
    <a-layout style="height: 100%">
      <a-layout style="align-items: stretch">
        <div ref="canvas" id="canvas" class="canvas" :style="{ minHeight: height + 'px' }"></div>
        <a-drawer :visible="drawerVisible" title="流程信息" :width="450" placement="right" :closable="true" @close="drawerVisible = false">
          <a-timeline>
            <a-timeline-item v-for="o in currentTaskList" :key="o.id">
              <p>开始时间: {{ o.startTime }}</p>
              <p>状态：{{ stateNameConvert(o.state) }}</p>
              <p>处理结果：{{ dictConvert('BpmTaskResult', o.result) }}</p>
              <p>处理人: {{ o.userName }}</p>
              <p>结束时间: {{ o.endTime ? o.endTime : '' }}</p>
              <p>审批意见：{{ o.reason ? o.reason : '' }}</p>
            </a-timeline-item>
          </a-timeline>
        </a-drawer>
        <a-layout-sider
          class="sider"
          style="
            background: #fff;
            min-width: 40px;
            width: 40px;
            max-width: 40px;
            border-left: 1px solid #eeeeee;
            box-shadow: 0 0 8px #cccccc;
          "
        />
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
  import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

  // 汉化
  import customTranslate from './common/customTranslate'
  import Modeler from 'bpmn-js/lib/Modeler'
  // 引入flowable的节点文件
  import flowableModdle from './flowable/flowable.json'

  import { addArrow } from './processViewerUtils'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { $ref } from 'vue/macros'
  import { nextTick, onMounted, watch, watchEffect } from 'vue'

  const { dictConvert } = useDict()
  const props = withDefaults(
    defineProps<{
      // bpmn流程图
      xml: string
      // 实例
      instance: any
      // 执行流程节点
      flowNodeList: any
      // 节点流程任务组
      nodeTaskList: any
      // 画布高度
      height: number
    }>(),
    {
      xml: '',
      instance: {},
      flowNodeList: [],
      nodeTaskList: {},
      height: 650,
    },
  )

  let canvas = $ref()

  let modeler = $ref<any>()
  let zoom = $ref(1)
  let element = $ref(null)
  let drawerVisible = $ref(false)
  let currentTaskList = $ref([])

  // 流程相关变量, 不需要进行响应式
  let elementOverlayIds
  let overlays

  watchEffect(() => {
    initModeler()
  })

  /**
   * 生成实例
   */
  function initModeler() {
    nextTick(async () => {
      modeler = new Modeler({
        container: '#canvas',
        propertiesPanel: {},
        additionalModules: [
          {
            translate: ['value', customTranslate],
            paletteProvider: ['value', ''], // 禁用/清空左侧工具栏
            labelEditingProvider: ['value', ''], // 禁用节点编辑
            contextPadProvider: ['value', ''], // 禁用图形菜单
            AppendContextPadProvider: ['value', ''],
            bendpoints: ['value', {}], // 禁用连线拖动
            // zoomScroll: ['value', ''], // 禁用滚动
            // moveCanvas: ['value', ''], // 禁用拖动整个流程图
            move: ['value', ''], // 禁用单个图形拖动
          },
        ],
        moddleExtensions: {
          flowable: flowableModdle,
        },
      })
      await createDiagram()
      initEventBind()
    })
  }

  /**
   * 创建流程图
   */
  async function createDiagram() {
    // modeler需要初始化完毕且已经有 xml 参数后才进行渲染
    if (!props.xml || !modeler) {
      return
    }
    // 将字符串转换成图显示出来
    const data = props.xml.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
      return str.replace(/</g, '&lt;')
    })
    await modeler.importXML(data)
    initSvg()
    fillColor()
    fitViewport()
  }
  /**
   * 给节点绑定事件 信息显示处理,
   */
  function initEventBind() {
    const eventBus = modeler.get('eventBus')
    // 注册需要的监听事件
    const types = ['bpmn:UserTask', 'bpmn:StartEvent', 'bpmn:EndEvent']
    eventBus.on('element.hover', (eventObj) => {
      const element = eventObj ? eventObj.element : null
      if (types.includes(element.type)) {
        elementHover(element)
      }
    })
    eventBus.on('element.out', (eventObj) => {
      const element = eventObj ? eventObj.element : null
      if (types.includes(element.type)) {
        elementOut(element)
      }
    })
    eventBus.on('element.click', (eventObj) => {
      const element = eventObj ? eventObj.element : null
      if (element.type === 'bpmn:UserTask') {
        elementClick(element)
      }
    })
  }
  /**
   *  流程图的元素被 hover
   */
  function elementHover(e) {
    element = e
    !elementOverlayIds && (elementOverlayIds = {})
    !overlays && (overlays = modeler.get('overlays'))

    let html = ''
    if (e.type === 'bpmn:StartEvent') {
      html = `<span>发起人：${props.instance.startUserName}</span>
                  <span>发起时间：${props.instance.startTime}</span>`
    }
    if (e.type === 'bpmn:UserTask') {
      const tasks = props.nodeTaskList[e.id]
      if (tasks) {
        // 显示第一条任务信息
        const task = tasks[0]
        if (task) {
          html += `<span>执行人：${task.userName}</span>
                  <span>状态：${stateNameConvert(task.state)}</span>
                  <span>处理结果：${dictConvert('BpmTaskResult', task.result)}</span>
                  <span>结束时间：${task.endTime ? task.endTime : ''}</span>
                  <span>审批意见：${task.reason ? task.reason : ''}</span>`
        }
        // 多次处理会提示点击查看详情
        if (tasks[1]) {
          html += `</br>
            <span>点击查看更多...</span>`
        }
      } else {
        return
      }
    }
    if (e.type === 'bpmn:EndEvent') {
      // 判断节点是否结束
      if (!props.instance.endTime) {
        return
      }
      html = `<span>结束时间：${props.instance.endTime}</span>`
    }
    elementOverlayIds[e.id] = overlays.add(e, {
      position: { left: -50, bottom: 10 },
      html: `<div class="element-overlays">${html}</div>`,
    })
  }
  /**
   * 流程图的元素被 out
   */
  function elementOut(element) {
    overlays.remove({ element })
    elementOverlayIds[element.id] = null
  }
  /**
   * 点击事件
   */
  function elementClick(element) {
    currentTaskList = props.nodeTaskList[element.id]
    if (currentTaskList) {
      drawerVisible = true
    }
  }
  /**
   * 处理SVG元素
   */
  function initSvg() {
    // 添加完成箭头
    addArrow()
  }
  /**
   * 染色
   */
  function fillColor() {
    const canvas = modeler.get('canvas')
    modeler._definitions.rootElements[0].flowElements.forEach((n) => {
      const state = getNodeTaskState(n)
      if (['pass', 'skip'].includes(state)) {
        canvas.addMarker(n.id, 'highlight')
      } else if (state === 'running') {
        canvas.addMarker(n.id, 'highlight-todo')
      } else if (state === 'reject') {
        canvas.addMarker(n.id, 'highlight-reject')
      } else if (['back', 'cancel', 'retrieve'].includes(state)) {
        canvas.addMarker(n.id, 'highlight-cancel')
      } else {
        // 其他状态不进行处理
      }
    })
  }
  /**
   * 让图能自适应屏幕
   */
  function fitViewport() {
    zoom = modeler.get('canvas').zoom('fit-viewport')
    const bbox = document.querySelector('.flow-containers .viewport').getBBox()
    const currentViewbox = modeler.get('canvas').viewbox()
    const elementMid = {
      x: bbox.x + bbox.width / 2 - 65,
      y: bbox.y + bbox.height / 2,
    }
    modeler.get('canvas').viewbox({
      x: elementMid.x - currentViewbox.width / 2,
      y: elementMid.y - currentViewbox.height / 2,
      width: currentViewbox.width,
      height: currentViewbox.height,
    })
    zoom = (bbox.width / currentViewbox.width) * 1.8
  }
  /**
   * 获取节点的任务状态
   */
  function getNodeTaskState(node) {
    if (props.nodeTaskList) {
      const tasks = props.nodeTaskList[node.id]
      if (!tasks) {
        // 处理非用户任务节点
        return props.flowNodeList.find((m) => m.activityId === node.id) ? 'pass' : ''
      }
      // 是否是多个
      if (tasks?.length > 1) {
        // 判断是否有执行中状态
        return tasks.find((t) => t.state === 'running') ? 'running' : tasks[0].state
      } else {
        return tasks[0].state
      }
    }
  }
  /**
   * 任务状态翻译
   */
  function stateNameConvert(state) {
    return dictConvert('BpmTaskState', state)
  }
</script>

<style lang="less" scoped>
  // Font class
  @import './icon/iconfont.css';
  @import './css/ProcessViewerHighlight.less';

  .view-mode {
    .ant-layout-header,
    .ant-layout-sider,
    :deep(.djs-palette),
    :deep(.bjs-powered-by) {
      ///deep/.djs-palette,
      ///deep/.bjs-powered-by {
      display: none;
    }
  }
  // 信息显示框
  :deep(.element-overlays) {
    ///deep/.element-overlays {
    display: grid;
    box-sizing: border-box;
    padding: 8px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    color: #fafafa;
    width: 230px;
  }

  html,
  body,
  #app {
    height: 100%;
  }

  .iconfont {
    margin-right: 5px;
  }

  .flow-containers {
    // background-color: #ffffff;
    width: 100%;
    height: 100%;
    .canvas {
      width: 100%;
      height: 100%;
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
    ///deep/.ant-layout-sider:hover {
    background: #0a97ce25 !important;
  }

  :deep(.ant-layout-sider) {
    ///deep/.ant-layout-sider {
    z-index: 2;
  }

  //:deep(.djs-container) {
  /deep/ .djs-container {
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+)
      repeat !important;
  }
</style>
