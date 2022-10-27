<template>
  <div id="app-menu" v-cloak>
    <!-- 预览窗 -->
    <div class="weixin-preview">
      <div class="weixin-hd">
        <div class="weixin-title">{{ title }}</div>
      </div>
      <div class="weixin-bd">
        <ul class="weixin-menu" id="weixin-menu" >
          <li
            v-for="(mainMenu,mainIndex) in menu.buttons"
            class="menu-item"
            :key="mainIndex"
            :class="{current:currentMenu===mainMenu}"
            @click="selectedMainMenu(mainIndex,mainMenu)">
            <div class="menu-item-title">
              <i class="icon_menu_dot"></i>
              <span>{{ mainMenu.name }}</span>
            </div>
            <ul class="weixin-sub-menu" v-show="currentMenuIndex===mainIndex">
              <li
                v-for="(subMenu,subjectIndex) in mainMenu.subButtons"
                class="menu-sub-item"
                :key="subjectIndex"
                :class="{current:currentMenu===subMenu}"
                @click.stop="selectedSubMenu(subjectIndex,subMenu)">
                <div class="menu-item-title">
                  <span>{{ subMenu.name }}</span>
                </div>
              </li>
              <li v-if="mainMenu.subButtons.length<5" class="menu-sub-item" @click.stop="addSubMenuConfirm(mainMenu)">
                <div class="menu-item-title">
                  <i class="icon14_menu_add"></i>
                </div>
              </li>
            </ul>
          </li>
          <li class="menu-item" v-if="menu.buttons.length<3" @click="addMainMenu()">
            <i class="icon14_menu_add"></i>
          </li>
        </ul>
      </div>
    </div>
    <!-- 菜单信息编辑 -->
    <wx-menu-detail-editor
      v-model="currentMenu"
      :menu-detail-type="currentMenuTyp"
      :showable="showable"
      @delete="delMenu"
    ></wx-menu-detail-editor>
  </div>
</template>

<script>

import './menu.less'
import WxMenuDetailEditor from '@/views/modules/third/wechat/menu/edit/WxMenuDetailEditor'
import { MenuTypeMain, MenuTypeMainSubject, MenuTypeSubject } from './MenuType'

export default {
  name: 'WxMenuEdit',
  components: { WxMenuDetailEditor },
  model: {
    // 自定义为v-model
    prop: 'menu'
  },
  props: {
    // 查询条件
    menu: {
      type: Object,
      default: () => {
        return {
          buttons: []
        }
      }
    },
    // 是否是查询看状态
    showable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 菜单类型
      MenuTypeMain,
      MenuTypeMainSubject,
      MenuTypeSubject,
      // 当前选中菜单的类型
      currentMenuTyp: '',
      // 当前选中(焦点所在)的菜单
      currentMenu: {},
      // 当前选中菜单索引
      currentMenuIndex: -1,
      // 当前选中子菜单索引
      currentSubMenuIndex: -1,
      // 标题
      title: ''
    }
  },
  methods: {
    /**
     * 选中主菜单
     * @param i
     * @param menu 微信菜单按钮内容
     */
    selectedMainMenu (i, menu) {
      if (menu.subButtons.length) {
        this.currentMenuTyp = MenuTypeMainSubject
      } else {
        this.currentMenuTyp = MenuTypeMain
      }
      console.log(menu)
      this.currentMenu = menu
      this.currentSubMenuIndex = -1
      this.currentMenuIndex = i
    },
    /**
     * 选中子菜单
     */
    selectedSubMenu (i, menu) {
      this.currentMenuTyp = MenuTypeSubject
      this.currentSubMenuIndex = i
      this.currentMenu = menu
    },
    /**
     *  添加主菜单
     */
    addMainMenu () {
      if (this.showable) { return }
      const buttons = this.menu.buttons
      // 主菜单添加
      if (buttons.length < 3) {
        buttons.push({
          type: 'view',
          name: '菜单名称',
          subButtons: [],
          url: ''
        })
        // 当前选中菜单类型
        this.currentMenuTyp = MenuTypeMain
        this.currentMenuIndex = this.menu.buttons.length - 1
        this.currentSubMenuIndex = -1
        this.currentMenu = buttons[buttons.length - 1]
      }
    },
    /**
     * 添加子菜单 确认
     * @param mainMenu 子菜单所属的主菜单
     */
    addSubMenuConfirm (mainMenu) {
      if (this.showable) { return }
      if (mainMenu.subButtons.length < 5) {
        // 判断所属的主菜单是否有内容
        if (!mainMenu.subButtons.length) {
          this.$confirm({
            title: '提示',
            content: '添加子菜单将会清空菜单信息',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              console.log(mainMenu)
              // 清空其他数据
              delete mainMenu.type
              this.addSubMenu(mainMenu)
            }
          })
        } else {
          this.addSubMenu(mainMenu)
        }
      }
    },
    /**
     * 添加子菜单
     */
    addSubMenu (mainMenu) {
      mainMenu.subButtons.push({
        type: 'view',
        name: '子菜单名称',
        url: ''
      })
      // 当前选中菜单类型变为子菜单
      this.currentMenuTyp = MenuTypeSubject
      // 子菜单索引
      this.currentSubMenuIndex = mainMenu.subButtons.length - 1
      this.currentMenu = mainMenu.subButtons[mainMenu.subButtons.length - 1]
    },
    /**
     * 删除菜单
     */
    async delMenu () {
      this.$confirm({
        title: '提示',
        content: '是否删除该菜单及包含的内容?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          // 主菜单
          if ([MenuTypeMain, MenuTypeMainSubject].includes(this.currentMenuTyp)) {
            // 如果有子菜单, 需要二次确认
            this.menu.buttons.splice(this.currentMenuIndex, 1)
            // 重新定位焦点
            this.currentMenuIndex = -1
            this.currentMenu = null
            this.currentMenuTyp = null
          } else {
            const subButton = this.menu.buttons[this.currentMenuIndex].subButtons
            subButton.splice(this.currentSubMenuIndex, 1)
            // 重新定位焦点
            this.currentMenuIndex = -1
            this.currentSubMenuIndex = -1
            this.currentMenu = null
            this.currentMenuTyp = null
          }
        }
      })
    },
  },
  mounted () {
    console.log(this.showable)
  }
}
</script>

<style lang="less" scoped>

</style>
