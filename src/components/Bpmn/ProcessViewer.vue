<template>
  <div class="flow-containers view-mode" style="height: 100%">
    <a-layout style="height: 100%">
      <a-layout style="align-items: stretch">
        <div ref="canvas" class="canvas" :style="{ minHeight: height + 'px' }"></div>
        <!--        <a-drawer :visible="drawerVisible" title="流程信息" :width="450" placement="right" :closable="true" @close="drawerVisible = false">-->
        <!--          <a-timeline>-->
        <!--            <a-timeline-item v-for="o in currentTaskList" :key="o.id">-->
        <!--              <p>开始时间: {{ o.startTime }}</p>-->
        <!--              <p>状态：{{ stateNameConvert(o.state) }}</p>-->
        <!--              <p>处理结果：{{ dictConvert('BpmTaskResult', o.result) }}</p>-->
        <!--              <p>处理人: {{ o.userName }}</p>-->
        <!--              <p>结束时间: {{ o.endTime ? o.endTime : '' }}</p>-->
        <!--              <p>审批意见：{{ o.reason ? o.reason : '' }}</p>-->
        <!--            </a-timeline-item>-->
        <!--          </a-timeline>-->
        <!--        </a-drawer>-->
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

<script>
  // 汉化
  import customTranslate from './common/customTranslate'
  import Modeler from 'bpmn-js/lib/Modeler'
  // 引入flowable的节点文件
  import flowableModdle from './flowable/flowable.json'

  import { addArrow } from './processViewerUtils'
  import { useDict } from '/@/hooks/bootx/useDict'

  const { dictConvert } = useDict()

  export default {
    name: 'WorkflowBpmnModeler',
    props: {
      // bpmn流程图
      xml: { type: String, default: '' },
      // 实例
      instance: { type: Object, default: () => {} },
      // 执行流程节点
      flowNodeList: { type: Array, default: () => [] },
      // 节点流程任务组
      nodeTaskList: { type: Object, default: () => {} },
      // 画布高度
      height: { type: Number, default: 650 },
    },
    data() {
      return {
        modeler: null,
        zoom: 1,
        element: null,
        drawerVisible: false,
        currentTaskList: [],
        cs: 1,
      }
    },
    watch: {
      cs(val) {
        if (val) {
        }
      },
      xml: {
        handler(newQuestion) {
          // 在组件实例创建时会立即调用
          console.log(newQuestion)
          this.createDiagram()
        },
      },
      // xml(val) {
      //   console.log(1)
      //   if (val) {
      //     this.createDiagram()
      //   }
      // },
      flowNodeList(val) {
        console.log(2)
        if (val) {
          this.createDiagram()
        }
      },
      nodeTaskList(val) {
        console.log(3)
        if (val) {
          this.createDiagram()
        }
      },
    },
    mounted() {
      this.initModeler()
      this.initEventBind()
      setInterval(() => {
        this.cs++
      }, 2000)
    },
    methods: {
      /**
       * 生成实例
       */
      initModeler() {
        this.modeler = new Modeler({
          container: this.$refs.canvas,
          additionalModules: [
            {
              translate: ['value', customTranslate],
              paletteProvider: ['value', ''], // 禁用/清空左侧工具栏
              labelEditingProvider: ['value', ''], // 禁用节点编辑
              contextPadProvider: ['value', ''], // 禁用图形菜单
              bendpoints: ['value', {}], // 禁用连线拖动
              zoomScroll: ['value', ''], // 禁用滚动
              moveCanvas: ['value', ''], // 禁用拖动整个流程图
              move: ['value', ''], // 禁用单个图形拖动
            },
          ],
          moddleExtensions: {
            flowable: flowableModdle,
          },
        })
      },
      /**
       * 创建流程图
       */
      async createDiagram() {
        if (!this.xml) {
          return
        }
        // 将字符串转换成图显示出来
        const data = this.xml.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
          return str.replace(/</g, '&lt;')
        })
        await this.modeler.importXML(data)
        this.initSvg()
        this.fillColor()
        this.fitViewport()
      },

      /**
       * 给节点绑定事件 信息显示处理,
       */
      initEventBind() {
        const eventBus = this.modeler.get('eventBus')
        // 注册需要的监听事件
        const types = ['bpmn:UserTask', 'bpmn:StartEvent', 'bpmn:EndEvent']
        eventBus.on('element.hover', (eventObj) => {
          const element = eventObj ? eventObj.element : null
          if (types.includes(element.type)) {
            this.elementHover(element)
          }
        })
        eventBus.on('element.out', (eventObj) => {
          const element = eventObj ? eventObj.element : null
          if (types.includes(element.type)) {
            this.elementOut(element)
          }
        })
        eventBus.on('element.click', (eventObj) => {
          const element = eventObj ? eventObj.element : null
          if (element.type === 'bpmn:UserTask') {
            this.elementClick(element)
          }
        })
      },
      /**
       *  流程图的元素被 hover
       */
      elementHover(element) {
        this.element = element
        !this.elementOverlayIds && (this.elementOverlayIds = {})
        !this.overlays && (this.overlays = this.modeler.get('overlays'))

        let html = ''
        if (element.type === 'bpmn:StartEvent') {
          html = `<span>发起人：${this.instance.startUserName}</span>
                  <span>发起时间：${this.instance.startTime}</span>`
        }
        if (element.type === 'bpmn:UserTask') {
          const tasks = this.nodeTaskList[element.id]
          if (tasks) {
            const task = tasks[0]
            if (task) {
              html += `<span>执行人：${task.userName}</span>
                  <span>状态：${this.stateNameConvert(task.state)}</span>
                  <span>处理结果：${dictConvert('BpmTaskResult', task.result)}</span>
                  <span>结束时间：${task.endTime ? task.endTime : ''}</span>
                  <span>审批意见：${task.reason ? task.reason : ''}</span>`
            }
            if (tasks[1]) {
              html += `</br>
            <span>点击查看更多...</span>`
            }
          } else {
            return
          }
        }
        if (element.type === 'bpmn:EndEvent') {
          // 判断节点是否结束
          if (!this.instance.endTime) {
            return
          }
          html = `<span>结束时间：${this.instance.endTime}</span>`
        }
        this.elementOverlayIds[element.id] = this.overlays.add(element, {
          position: { left: -50, bottom: 10 },
          html: `<div class="element-overlays">${html}</div>`,
        })
      },
      /**
       * 流程图的元素被 out
       */
      elementOut(element) {
        this.overlays.remove({ element })
        this.elementOverlayIds[element.id] = null
      },
      /**
       * 点击事件
       */
      elementClick(element) {
        this.currentTaskList = this.nodeTaskList[element.id]
        if (this.currentTaskList) {
          this.drawerVisible = true
        }
      },
      /**
       * 处理SVG元素
       */
      initSvg() {
        // 添加完成箭头
        addArrow()
      },

      /**
       * 染色
       */
      fillColor() {
        const canvas = this.modeler.get('canvas')
        this.modeler._definitions.rootElements[0].flowElements.forEach((n) => {
          const state = this.getNodeTaskState(n)
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
      },
      /**
       * 让图能自适应屏幕
       */
      fitViewport() {
        this.zoom = this.modeler.get('canvas').zoom('fit-viewport')
        const bbox = document.querySelector('.flow-containers .viewport').getBBox()
        const currentViewbox = this.modeler.get('canvas').viewbox()
        const elementMid = {
          x: bbox.x + bbox.width / 2 - 65,
          y: bbox.y + bbox.height / 2,
        }
        this.modeler.get('canvas').viewbox({
          x: elementMid.x - currentViewbox.width / 2,
          y: elementMid.y - currentViewbox.height / 2,
          width: currentViewbox.width,
          height: currentViewbox.height,
        })
        this.zoom = (bbox.width / currentViewbox.width) * 1.8
      },
      /**
       * 获取节点的任务状态
       */
      getNodeTaskState(node) {
        if (this.nodeTaskList) {
          const tasks = this.nodeTaskList[node.id]
          if (!tasks) {
            // 处理非用户任务节点
            return this.flowNodeList.find((m) => m.activityId === node.id) ? 'pass' : ''
          }
          // 是否是多个
          if (tasks?.length > 1) {
            // 判断是否有执行中状态
            return tasks.find((t) => t.state === 'running') ? 'running' : tasks[0].state
          } else {
            return tasks[0].state
          }
        }
      },
      /**
       * 任务状态翻译
       */
      stateNameConvert(state) {
        return dictConvert('BpmTaskState', state)
      },
    },
  }
</script>

<style lang="less" scoped>
  // Font class
  @import './icon/iconfont.css';
  /*左边工具栏以及编辑节点的样式*/
  @import 'bpmn-js/dist/assets/diagram-js.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

  @import './css/ProcessViewerHighlight.less';
  .view-mode {
    .ant-layout-header,
    .ant-layout-sider,
    /deep/.djs-palette,
    /deep/.bjs-powered-by {
      display: none;
    }
  }
  // 信息显示框
  /deep/.element-overlays {
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

  /deep/ .ant-layout-sider:hover {
    background: #0a97ce25 !important;
  }

  /deep/ .ant-layout-sider {
    z-index: 2;
  }

  /deep/ .djs-container {
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+)
      repeat !important;
  }
</style>
