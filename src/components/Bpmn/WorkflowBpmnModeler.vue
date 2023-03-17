<template>
  <div class="flow-containers" style="height: 100%" :class="{ 'view-mode': isView }">
    <a-layout style="height: 100%">
      <a-layout-header theme="light" style="border-bottom: 1px solid rgb(218 218 218); height: auto; background-color: #fff">
        <div style="display: flex; padding: 5px 0px; justify-content: space-between">
          <a-space>
            <a-upload v-if="isEdit" name="file" action="" accept=".bpmn,.xml" :showUploadList="false" :beforeUpload="openBpmn">
              <a-tooltip effect="dark" title="打开" placement="bottom">
                <a-button>
                  <i class="iconfont icon-file-open"></i>
                </a-button>
              </a-tooltip>
            </a-upload>
            <a-tooltip v-if="isEdit" effect="dark" title="清空" placement="bottom">
              <a-button @click="clearDiagram">
                <a-icon type="delete" />
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="自适应屏幕" placement="bottom">
              <a-button @click="fitViewport">
                <i class="iconfont icon-browse"></i>
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="放大" placement="bottom">
              <a-button @click="zoomViewport(true)">
                <i class="iconfont icon-zoom-out"></i>
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="缩小" placement="bottom">
              <a-button @click="zoomViewport(false)">
                <i class="iconfont icon-zoom-in"></i>
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="撤销(增删操作有效)" placement="bottom">
              <a-button @click="undo">
                <a-icon type="undo" />
              </a-button>
            </a-tooltip>
            <a-tooltip title="重做(增删操作有效)" placement="bottom">
              <a-button @click="redo">
                <a-icon type="redo" />
              </a-button>
            </a-tooltip>
            <slot name="header-left"></slot>
          </a-space>
          <a-space>
            <slot name="header-right"></slot>
            <a-button @click="showXML"> <i class="iconfont icon-browse"></i>XML </a-button>
            <a-button @click="saveXML(true)"> <i class="iconfont icon-download"></i>XML </a-button>
            <a-button @click="saveImg('svg', true)"> <i class="iconfont icon-download"></i>SVG </a-button>
            <a-button type="primary" @click="save" v-if="isEdit"> <i class="iconfont icon-upload"></i> 保存 </a-button>
            <a-button type="danger" @click="cancel"> <a-icon type="close" /> 关闭 </a-button>
          </a-space>
        </div>
      </a-layout-header>
      <a-layout style="align-items: stretch">
        <a-layout-content style="padding: 0; margin-top: 10px">
          <div ref="canvas" class="canvas"></div>
        </a-layout-content>
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
        >
          <div style="width: 100%; text-align: center" @click="panelVisible = true">
            <i class="iconfont icon-left-graph" style="font-size: 32px" v-if="panelExist"></i>
          </div>

          <a-drawer
            width="400px"
            placement="right"
            :closable="false"
            :visible="panelVisible && panelExist"
            :get-container="false"
            :wrap-style="{ position: 'absolute' }"
          >
            <template #title>
              <i class="iconfont icon-right-graph" style="font-size: 32px" @click="panelVisible = false"></i><span>{{ panelTitle }}</span>
            </template>
            <panel
              v-if="modeler"
              ref="panel"
              :filters="panelFilters"
              :modeler="modeler"
              :users="users"
              :groups="groups"
              :categories="categories"
              :categories-fields="categoriesFields"
              :associate-form-config="associateFormConfig"
              :associate-form-data-options="associateFormDataOptions"
              :assignee-data-source="assigneeDataSource"
              :due-date-data-source="dueDateDataSource"
              :follow-up-date-data-source="followUpDateDataSource"
              :initiator-data-source="initiatorDataSource"
              :skip-expression-data-source="skipExpressionDataSource"
              :condition-expression-data-source="conditionExpressionDataSource"
              :candidate-user-data-source="candidateUserDataSource"
              :candidate-group-data-source="candidateGroupDataSource"
              @showForm="showAssociateForm"
              @createForm="createAssociateForm"
              @change="handlePanelChange"
            />
          </a-drawer>
        </a-layout-sider>
      </a-layout>
    </a-layout>
    <!--  xml预览  -->
    <a-modal
      :visible="codeVisible"
      title="XML"
      width="60%"
      style="height: 750px"
      :dialog-style="{ top: '20px' }"
      @change="codeVisible = $event"
    >
      <div class="codediv">
        <codemirror v-model="xmlCode" :options="options" />
      </div>

      <template #footer> </template>
    </a-modal>
  </div>
</template>

<script>
  // 汉化
  import customTranslate from './common/customTranslate'
  import Modeler from 'bpmn-js/lib/Modeler'
  import panel from './PropertyPanel'
  import BpmData from './BpmData'
  import getInitStr from './flowable/designData'
  // 引入flowable的节点文件
  import flowableModdle from './flowable/flowable.json'

  import { codemirror } from 'vue-codemirror-lite'
  import 'codemirror/lib/codemirror.css'
  // 引入主题,配置后生效
  import 'codemirror/theme/rubyblue.css'
  // 引入语言,配置后生效
  import 'codemirror/mode/xml/xml.js'

  const nodePanelFilters = ['子流程', '调用活动']
  export default {
    name: 'WorkflowBpmnModeler',
    components: {
      panel,
      codemirror,
    },
    props: {
      isEdit: {
        type: Boolean,
        default: () => true,
      },
      categoriesFields: {
        type: Object,
      },
      // 过滤面板参数
      panelFilters: {
        type: Array,
      },
      paletteToolShow: {
        type: Boolean,
        default: () => true,
      },
      // 控制过滤
      paletteFilters: {
        type: Array,
        default: () => [],
      },
      rightActionConfig: {
        type: Object,
        default: () => {
          return {
            showCode: {
              show: true,
              icon: true,
              label: 'XML',
            },
            downloadXML: {
              show: true,
              icon: true,
              label: 'XML',
            },
            downloadSVG: {
              show: true,
              icon: true,
              label: 'SVG',
            },
            save: {
              show: true,
              icon: true,
              label: '保存',
            },
            cancel: {
              show: true,
              icon: true,
              label: '关闭',
            },
          }
        },
      },
      xml: {
        type: String,
        default: '',
      },
      taskList: {
        type: Array,
        default: () => [],
      },

      users: {
        type: Array,
        default: () => [],
      },
      groups: {
        type: Array,
        default: () => [],
      },
      categories: {
        type: Array,
        default: () => [],
      },
      isView: {
        type: Boolean,
        default: false,
      },
      associateFormConfig: {
        type: Object,
      },
      associateFormDataOptions: {
        type: Array,
        default: () => [],
      },
      assigneeDataSource: {
        type: Array,
        default: () => ['#{approval}', '${approverId}', '${INITIATOR}'],
      },
      dueDateDataSource: {
        type: Array,
        default: () => ['${dueDate}'],
      },
      followUpDateDataSource: {
        type: Array,
        default: () => ['${followUpDate}'],
      },
      initiatorDataSource: {
        type: Array,
        default: () => ['initiator'],
      },
      skipExpressionDataSource: {
        type: Array,
        default: () => [],
      },
      conditionExpressionDataSource: {
        type: Array,
        default: () => ['${approve}', '${!approve}'],
      },
      candidateUserDataSource: {
        type: Array,
        default: () => [],
      },
      candidateGroupDataSource: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        panelTitle: '',
        panelVisible: true,
        panelExist: false,
        modeler: null,
        zoom: 1,
        codeVisible: false,
        xmlCode: '',
        // 需编辑和显示的内容
        // 默认配置
        options: {
          tabSize: 2, // 缩进格式
          theme: 'rubyblue', // 指定主题，对应主题库 JS 需要提前引入
          lineNumbers: true, // 是否显示行号
          // 指定语言类型,如果需要编辑和显示其他语言,需要import语言js然后修改此配置
          mode: 'xml',
          line: true,
          styleActiveLine: true, // 高亮选中行
          // 是否为只读,如果为"nocursor" 不仅仅为只读 连光标都无法在区域聚焦
          readOnly: true,
          hintOptions: {
            completeSingle: true, // 当匹配只有一项的时候是否自动补全
          },
        },
      }
    },
    watch: {
      xml: function (val) {
        if (val) {
          this.createNewDiagram(val)
        }
      },
    },
    mounted() {
      if (this.isView) {
        // 生成实例
        this.modeler = new Modeler({
          container: this.$refs.canvas,
          additionalModules: [
            {
              translate: ['value', customTranslate],
              paletteProvider: ['value', ''], // 禁用/清空左侧工具栏
              labelEditingProvider: ['value', ''], // 禁用节点编辑
              contextPadProvider: ['value', ''], // 禁用图形菜单
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
      } else {
        // 生成实例
        this.modeler = new Modeler({
          container: this.$refs.canvas,
          additionalModules: [
            {
              translate: ['value', customTranslate],
            },
          ],
          moddleExtensions: {
            flowable: flowableModdle,
          },
        })
      }

      // 新增流程定义
      if (!this.xml) {
        this.newDiagram()
      } else {
        this.createNewDiagram(this.xml)
      }
    },
    methods: {
      handlePanelChange(title) {
        if (title.trim() === '') {
          this.panelExist = false
        } else {
          this.panelExist = nodePanelFilters.indexOf(title.trim()) === -1
        }
        this.panelTitle = title
      },
      newDiagram() {
        this.createNewDiagram(getInitStr())
      },
      // 清空画布
      clearDiagram() {
        this.$confirm({
          title: '警告',
          content: '是否要清空画布',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.newDiagram()
          },
        })
      },
      // 让图能自适应屏幕
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
      // 放大缩小
      zoomViewport(zoomIn = true) {
        this.zoom = this.modeler.get('canvas').zoom()
        this.zoom += zoomIn ? 0.1 : -0.1
        this.modeler.get('canvas').zoom(this.zoom)
      },
      async createNewDiagram(data) {
        // 将字符串转换成图显示出来
        // data = data.replace(/<!\[CDATA\[(.+?)]]>/g, '&lt;![CDATA[$1]]&gt;')
        data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
          return str.replace(/</g, '&lt;')
        })
        await this.modeler.importXML(data)
        this.adjustPalette()
        this.fitViewport()
      },
      // 调整左侧工具栏排版
      adjustPalette() {
        try {
          // 获取 bpmn 设计器实例
          const canvas = this.$refs.canvas
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
          for (var key in djsPalStyle) {
            djsPalette.style[key] = djsPalStyle[key]
          }
          const palette = djsPalette.children[0]
          const allGroups = palette.children
          // 是否隐藏工具栏
          if (!this.paletteToolShow) {
            allGroups[0].style['display'] = 'none'
          }

          // 修改控件样式
          for (var gKey in allGroups) {
            const group = allGroups[gKey]
            for (var cKey in group.children) {
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
                for (var csKey in controlStyle) {
                  control.style[csKey] = controlStyle[csKey]
                }

                // 过滤扩展栏
                if (this.paletteFilters.indexOf(control.dataset.action) !== -1) {
                  control.style['display'] = 'none'
                  continue
                }
              }
            }
          }
        } catch (e) {
          console.log(e)
        }
      },
      // 对外 api
      getProcess() {
        const element = this.getProcessElement()
        return {
          id: element.id,
          name: element.name,
          category: element.$attrs['flowable:processCategory'],
        }
      },
      getProcessElement() {
        const rootElements = this.modeler.getDefinitions().rootElements
        for (let i = 0; i < rootElements.length; i++) {
          if (rootElements[i].$type === 'bpmn:Process') return rootElements[i]
        }
      },
      /**
       * 撤消
       */
      undo() {
        this.modeler.get('commandStack').undo()
      },
      /**
       * 重做
       */
      redo() {
        this.modeler.get('commandStack').redo()
      },
      async showXML() {
        this.xmlCode = await this.saveXML(false)
        this.codeVisible = true
      },
      async saveXML(download = false) {
        try {
          const { xml } = await this.modeler.saveXML({ format: true })
          if (download) {
            this.downloadFile(`${this.getProcessElement().name}.bpmn20.xml`, xml, 'application/xml')
          }
          return xml
        } catch (err) {
          console.log(err)
        }
      },
      async saveImg(type = 'svg', download = false) {
        try {
          const { svg } = await this.modeler.saveSVG({ format: true })
          if (download) {
            this.downloadFile(this.getProcessElement().name, svg, 'image/svg+xml')
          }
          return svg
        } catch (err) {
          console.log(err)
        }
      },
      async save() {
        const process = this.getProcess()
        const xml = await this.saveXML()
        const svg = await this.saveImg()
        const result = { process, xml, svg }
        this.$emit('save', result)
        window.parent.postMessage(result, '*')
      },
      cancel() {
        this.$emit('cancel')
      },
      openBpmn(file) {
        // if (file.type !== 'text/xml') {
        //   this.$message.warn('请确保打开的是标准的BPMN文件')
        // }
        const reader = new FileReader()
        reader.readAsText(file, 'utf-8')
        reader.onload = () => {
          this.createNewDiagram(reader.result)
        }
        return false
      },
      downloadFile(filename, data, type) {
        var a = document.createElement('a')
        var url = window.URL.createObjectURL(new Blob([data], { type: type }))
        a.href = url
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(url)
      },
      showAssociateForm(formKey) {
        this.$emit('showForm', formKey)
      },
      createAssociateForm() {
        this.$emit('createForm')
      },
    },
  }
</script>

<style lang="less" scoped>
  // Font class
  @import './icon/iconfont.css';
  /*左边工具栏以及编辑节点的样式*/
  @import '~bpmn-js/dist/assets/diagram-js.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

  .view-mode {
    .ant-layout-header,
    .ant-layout-sider,
    /deep/.djs-palette,
    /deep/.bjs-powered-by {
      display: none;
    }
  }

  html,
  body,
  #app {
    height: 100%;
  }

  .codediv {
    height: 900px;
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
  /deep/ .ant-layout-sider:hover {
    background: #0a97ce25 !important;
  }

  /deep/ .ant-layout-sider {
    z-index: 2;
  }

  /deep/ .CodeMirror {
    border: 1px solid #eee;
    height: 900px !important;
  }

  /deep/ .djs-container {
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+)
      repeat !important;
  }
</style>
