<template>
  <div id="app-menu" v-cloak>
    <!-- 预览窗 -->
    <div class="weixin-preview">
      <div class="weixin-hd">
        <div class="weixin-title">{{ title }}</div>
      </div>
      <div class="weixin-bd">
        <ul class="weixin-menu" id="weixin-menu">
          <li
            v-for="(mainMenu, mainIndex) in menu.buttons"
            class="menu-item"
            :key="mainIndex"
            :class="{ current: currentMenu === mainMenu }"
            @click="selectedMainMenu(mainIndex, mainMenu)"
          >
            <div class="menu-item-title">
              <i class="icon_menu_dot"></i>
              <span>{{ mainMenu.name }}</span>
            </div>
            <ul class="weixin-sub-menu" v-show="currentMenuIndex === mainIndex">
              <li
                v-for="(subMenu, subjectIndex) in mainMenu.subButtons"
                class="menu-sub-item"
                :key="subjectIndex"
                :class="{ current: currentMenu === subMenu }"
                @click.stop="selectedSubMenu(subjectIndex, subMenu)"
              >
                <div class="menu-item-title">
                  <span>{{ subMenu.name }}</span>
                </div>
              </li>
              <li v-if="mainMenu.subButtons.length < 5" class="menu-sub-item" @click.stop="addSubMenuConfirm(mainMenu)">
                <div class="menu-item-title">
                  <i class="icon14_menu_add"></i>
                </div>
              </li>
            </ul>
          </li>
          <li class="menu-item" v-if="menu.buttons.length < 3" @click="addMainMenu()">
            <i class="icon14_menu_add"></i>
          </li>
        </ul>
      </div>
    </div>
    <!-- 菜单信息编辑 -->
    <wx-menu-detail-editor :menu-detail="currentMenu" :menu-detail-type="currentMenuTyp" :showable="showable" @delete="delMenu" />
  </div>
</template>

<script lang="ts" setup>
  import './menu.less'
  import { MenuTypeMain, MenuTypeMainSubject, MenuTypeSubject } from './MenuType'
  import WxMenuDetailEditor from './WxMenuDetailEditor.vue'
  import { $ref } from 'vue/macros'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { unref } from 'vue'
  interface Props {
    // 菜单信息
    menu: any
    // 是否是查询看状态
    showable: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    menu: {
      buttons: [],
    },
    showable: false,
  })

  const { createConfirm } = useMessage()

  // 当前选中菜单的类型
  let currentMenuTyp = $ref<string | null>('')
  // 当前选中(焦点所在)的菜单
  let currentMenu = $ref<object | null>({})
  // 当前选中菜单索引
  let currentMenuIndex = $ref(-1)
  // 当前选中子菜单索引
  let currentSubMenuIndex = $ref(-1)
  // 标题
  let title = $ref('')

  /**
   * 选中主菜单
   * @param i
   * @param menu 微信菜单按钮内容
   */
  function selectedMainMenu(i, menu) {
    if (menu.subButtons.length) {
      currentMenuTyp = MenuTypeMainSubject
    } else {
      currentMenuTyp = MenuTypeMain
    }
    currentMenu = unref(menu)
    currentSubMenuIndex = -1
    currentMenuIndex = i
  }
  /**
   * 选中子菜单
   */
  function selectedSubMenu(i, menu) {
    currentMenuTyp = MenuTypeSubject
    currentSubMenuIndex = i
    currentMenu = unref(menu)
  }
  /**
   *  添加主菜单
   */
  function addMainMenu() {
    if (props.showable) {
      return
    }
    const buttons = props.menu.buttons
    // 主菜单添加
    if (buttons.length < 3) {
      buttons.push({
        type: 'view',
        name: '菜单名称',
        subButtons: [],
        url: '',
      })
      // 当前选中菜单类型
      currentMenuTyp = MenuTypeMain
      currentMenuIndex = props.menu.buttons.length - 1
      currentSubMenuIndex = -1
      currentMenu = buttons[buttons.length - 1]
    }
  }
  /**
   * 添加子菜单 确认
   * @param mainMenu 子菜单所属的主菜单
   */
  function addSubMenuConfirm(mainMenu) {
    if (props.showable) {
      return
    }
    if (mainMenu.subButtons.length < 5) {
      // 判断所属的主菜单是否有内容
      if (!mainMenu.subButtons.length) {
        createConfirm({
          iconType: 'warning',
          title: '提示',
          content: '添加子菜单将会清空菜单信息',
          onOk: () => {
            // 清空其他数据
            delete mainMenu.type
            addSubMenu(mainMenu)
          },
        })
      } else {
        addSubMenu(mainMenu)
      }
    }
  }
  /**
   * 添加子菜单
   */
  function addSubMenu(mainMenu) {
    mainMenu.subButtons.push({
      type: 'view',
      name: '子菜单名称',
      url: '',
    })
    // 当前选中菜单类型变为子菜单
    currentMenuTyp = MenuTypeSubject
    // 子菜单索引
    currentSubMenuIndex = mainMenu.subButtons.length - 1
    currentMenu = mainMenu.subButtons[mainMenu.subButtons.length - 1]
  }
  /**
   * 删除菜单
   */
  function delMenu() {
    createConfirm({
      iconType: 'warning',
      title: '提示',
      content: '是否删除该菜单及包含的内容?',
      onOk: () => {
        // 主菜单
        if ([MenuTypeMain, MenuTypeMainSubject].includes(currentMenuTyp as string)) {
          // 如果有子菜单, 需要二次确认
          props.menu.buttons.splice(currentMenuIndex, 1)
          // 重新定位焦点
          currentMenuIndex = -1
          currentMenu = null
          currentMenuTyp = null
        } else {
          const subButton = props.menu.buttons[currentMenuIndex].subButtons
          subButton.splice(currentSubMenuIndex, 1)
          // 重新定位焦点
          currentMenuIndex = -1
          currentSubMenuIndex = -1
          currentMenu = null
          currentMenuTyp = null
        }
      },
    })
  }
</script>

<style lang="less" scoped></style>
