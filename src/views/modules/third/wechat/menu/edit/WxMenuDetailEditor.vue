<template>
  <div>
    <!-- 主菜单 -->
    <div class="weixin-menu-detail" v-if="menuDetailType">
      <div class="menu-input-group" style="border-bottom: 2px #e8e8e8 solid">
        <div class="menu-name">{{ menuDetail.name }}</div>
        <div class="menu-del" v-show="!showable" @click="delMenu">{{ '删除' + title }}</div>
      </div>
      <!--    单内容  -->
      <div class="menu-input-group">
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="菜单KEY值" prop="key">
            <a-input placeholder="用于消息接口推送，不超过128字节" :disabled="showable" v-model:value="menuDetail.key" />
          </a-form-item>
          <a-form-item :label="`${title}名称`" prop="name">
            <a-input :placeholder="`请输入${title}名称`" :disabled="showable" v-model:value="menuDetail.name" />
          </a-form-item>
          <a-form-item :label="`${title}类型`" v-if="menuDetailType !== MenuTypeMainSubject">
            <a-select
              :disabled="showable"
              :options="menuTypeOptions"
              :placeholder="`请选择${title}类型`"
              @change="menuTypeChange"
              v-model:value="menuDetail.type"
            />
          </a-form-item>
          <a-form-item label="页面地址" prop="url" v-if="editViewFlag">
            <a-input placeholder="订阅者点击该子菜单会跳到以下链接" :disabled="showable" v-model:value="menuDetail.url" />
          </a-form-item>
          <a-form-item label="小程序APPID" prop="appId" v-if="editMiniAppFlag">
            <a-input placeholder="小程序的appid（仅认证公众号可配置）" :disabled="showable" v-model:value="menuDetail.appId" />
          </a-form-item>
          <a-form-item label="小程序页面路径" prop="pagePath" v-if="editMiniAppFlag">
            <a-input placeholder="小程序的页面路径" :disabled="showable" v-model:value="menuDetail.pagePath" />
          </a-form-item>
          <a-form-item label="备用网页" prop="url" v-if="editMiniAppFlag">
            <a-input placeholder="旧版微信无法支持小程序时将会打开备用网页。" :disabled="showable" v-model:value="menuDetail.url" />
          </a-form-item>
          <a-form-item label="消息内容" prop="url" v-if="editMediaFlag">
            <a-input placeholder="发送消息，（除文本消息）从素材库中选择" disabled v-model:value="menuDetail.mediaId">
              <template #addonAfter v-if="!showable">
                <a-button size="small" type="link" v-if="!menuDetail.mediaId" @click="selectMedia" :disabled="showable">选择素材</a-button>
                <a-button size="small" type="link" danger v-else :disabled="showable" @click="menuDetail.mediaId = ''">清除</a-button>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item label="图文文章" prop="url" disabled v-if="editArticleFlag">
            <a-input placeholder="从已发表文章列表中选择" disabled="" v-model:value="menuDetail.articleId">
              <template #addonAfter>
                <a-button size="small" type="link" v-if="!menuDetail.articleId" @click="selectArticle" :disabled="showable"
                  >选择文章</a-button
                >
                <a-button size="small" type="link" danger v-else :disabled="showable" @click="menuDetail.articleId = ''">清除</a-button>
              </template>
            </a-input>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <we-chat-media-select ref="weChatMediaSelect" @ok="selectMediaCallback" />
    <we-chat-article-select ref="weChatArticleSelect" @ok="selectArticleCallback" />
  </div>
</template>

<script lang="ts" setup>
  import { MenuTypeMain, MenuTypeMainSubject, MenuTypeSubject } from './MenuType'
  import WeChatMediaSelect from '/@/views/modules/third/wechat/media/WechatMediaSelect.vue'
  import WeChatArticleSelect from '/@/views/modules/third/wechat/article/WechatArticleSelect.vue'
  import { $ref } from 'vue/macros'
  import { watch } from 'vue'

  interface Props {
    // '' 不显示, main 主菜单, mainSubject 主菜单下包含子菜单, subject 子菜单
    menuDetailType: string
    // 内容
    menuDetail: any
    // 是否是查询看状态
    showable: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    menuDetailType: '',
    menuDetail: {
      name: '',
    },
    showable: false,
  })

  watch(
    () => props.menuDetail.type,
    (newValue) => {
      menuTypeChange(newValue)
    },
  )
  watch(
    () => props.menuDetailType,
    (newValue) => {
      if ([MenuTypeMainSubject, MenuTypeMain].includes(newValue)) {
        title = '菜单'
      } else {
        title = '子菜单'
      }
    },
  )

  const emits = defineEmits(['delete', 'update:menuDetail'])

  const weChatMediaSelect = $ref<any>()
  const weChatArticleSelect = $ref<any>()

  const labelCol = { span: 6 }
  const wrapperCol = { span: 16 }
  let title = $ref('')
  // 菜单编辑项标识
  let editViewFlag = $ref(false)
  let editMiniAppFlag = $ref(false)
  let editMediaFlag = $ref(false)
  let editArticleFlag = $ref(false)
  // 菜单内容类型
  const menuTypeOptions = [
    { value: 'view', label: '跳转网页' },
    { value: 'click', label: '自定义点击事件' },
    { value: 'media_id', label: '点击回复' },
    { value: 'article_view_limited', label: '跳转图文消息链接' },
    { value: 'article_id', label: '图文卡片消息' },
    { value: 'miniprogram', label: '打开指定小程序' },
    { value: 'scancode_push', label: '扫码上传消息' },
    { value: 'scancode_waitmsg', label: '扫码提示下发' },
    { value: 'pic_sysphoto', label: '系统相机拍照' },
    { value: 'pic_photo_or_album', label: '弹出拍照或者相册' },
    { value: 'pic_weixin', label: '弹出微信相册' },
    { value: 'location_select', label: '弹出地理位置选择器' },
  ]

  /**
   * 删除
   */
  function delMenu() {
    emits('delete')
  }
  /**
   * 菜单类型变动
   */
  function menuTypeChange(value) {
    editViewFlag = false
    editMiniAppFlag = false
    editMediaFlag = false
    editArticleFlag = false
    if (['view'].includes(value)) {
      editViewFlag = true
    } else if (['miniprogram'].includes(value)) {
      editMiniAppFlag = true
    } else if (['media_id'].includes(value)) {
      editMediaFlag = true
    } else if (['article_view_limited', 'article_id'].includes(value)) {
      editArticleFlag = true
    } else {
    }
  }
  /**
   * 选择素材
   */
  function selectMedia() {
    weChatMediaSelect.show()
  }
  function selectMediaCallback(mediaId) {
    props.menuDetail.mediaId = mediaId
  }
  /**
   * 选择文章
   */
  function selectArticle() {
    weChatArticleSelect.show()
  }
  function selectArticleCallback(articleId) {
    props.menuDetail.articleId = articleId
  }
</script>

<style scoped></style>
