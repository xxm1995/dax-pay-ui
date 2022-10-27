<template>
  <div>
    <!-- 主菜单 -->
    <div class="weixin-menu-detail" v-if="menuDetailType">
      <div class="menu-input-group" style="border-bottom: 2px #e8e8e8 solid;">
        <div class="menu-name">{{ menuDetail.name }}</div>
        <div class="menu-del" v-show="!showable" @click="delMenu">{{ '删除'+title }}</div>
      </div>
      <!--    单内容  -->
      <div class="menu-input-group">
        <a-form-model
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="菜单KEY值" prop="key">
            <a-input placeholder="用于消息接口推送，不超过128字节" :disabled="showable" v-model="menuDetail.key"/>
          </a-form-model-item>
          <a-form-model-item :label="`${title}名称`" prop="name">
            <a-input :placeholder="`请输入${title}名称`" :disabled="showable" v-model="menuDetail.name"/>
          </a-form-model-item>
          <a-form-model-item :label="`${title}类型`" v-if="menuDetailType !== MenuTypeMainSubject">
            <a-select
              :disabled="showable"
              :options="menuTypeOptions"
              :placeholder="`请选择${title}类型`"
              @change="menuTypeChange"
              v-model="menuDetail.type"/>
          </a-form-model-item>
          <a-form-model-item label="页面地址" prop="url" v-if="editViewFlag">
            <a-input placeholder="订阅者点击该子菜单会跳到以下链接" :disabled="showable" v-model="menuDetail.url"/>
          </a-form-model-item>
          <a-form-model-item label="小程序APPID" prop="appId" v-if="editMiniAppFlag">
            <a-input placeholder="小程序的appid（仅认证公众号可配置）" :disabled="showable" v-model="menuDetail.appId"/>
          </a-form-model-item>
          <a-form-model-item label="小程序页面路径" prop="pagePath" v-if="editMiniAppFlag">
            <a-input placeholder="小程序的页面路径" :disabled="showable" v-model="menuDetail.pagePath"/>
          </a-form-model-item>
          <a-form-model-item label="备用网页" prop="url" v-if="editMiniAppFlag">
            <a-input placeholder="旧版微信无法支持小程序时将会打开备用网页。" :disabled="showable" v-model="menuDetail.url"/>
          </a-form-model-item>
          <a-form-model-item label="消息内容" prop="url" v-if="editMediaFlag">
            <a-input placeholder="发送消息，（除文本消息）从素材库中选择" disabled v-model="menuDetail.mediaId">
              <template #addonAfter v-if="!showable">
                <a v-if="!menuDetail.mediaId" @click="selectMedia" :disabled="showable">选择素材</a>
                <a href="javascript:" v-else :disabled="showable" @click="menuDetail.mediaId=''" style="color:red;">清除</a>
              </template>
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="图文文章" prop="url" disabled v-if="editArticleFlag">
            <a-input placeholder="从已发表文章列表中选择" disabled="" v-model="menuDetail.articleId">
              <template #addonAfter>
                <a href="javascript:" v-if="!menuDetail.articleId" @click="selectArticle" :disabled="showable">选择文章</a>
                <a href="javascript:" v-else :disabled="showable" @click="menuDetail.articleId=''" style="color:red;">清除</a>
              </template>
            </a-input>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <we-chat-media-select ref="weChatMediaSelect" @ok="selectMediaCallback"/>
    <we-chat-article-select ref="weChatArticleSelect" @ok="selectArticleCallback"/>
  </div>

</template>

<script>
import { MenuTypeMain, MenuTypeMainSubject, MenuTypeSubject } from './MenuType'
import WeChatMediaSelect from '@/views/modules/third/wechat/media/WeChatMediaSelect'
import WeChatArticleSelect from '@/views/modules/third/wechat/article/WeChatArticleSelect'

export default {
  name: 'WxMenuDetailEditor',
  components: { WeChatArticleSelect, WeChatMediaSelect },
  model: {
    prop: 'menuDetail'
  },
  props: {
    // '' 不显示, main 主菜单, mainSubject 主菜单下包含子菜单, subject 子菜单
    menuDetailType: {
      type: String,
      default: ''
    },
    menuDetail: {
      type: Object,
      default: () => {
        return {
          name: ''
        }
      }
    },
    // 是否是查询看状态
    showable: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    menuDetailType (newValue) {
      if ([MenuTypeMainSubject, MenuTypeMain].includes(newValue)) {
        this.title = '菜单'
      } else {
        this.title = '子菜单'
      }
    },
    // 监听菜单类型
    'menuDetail.type': {
      handler (newV) {
        this.menuTypeChange(newV)
      },
      immediate: true

    }
  },
  data () {
    return {
      MenuTypeMain,
      MenuTypeMainSubject,
      MenuTypeSubject,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      title: '',
      // 菜单编辑项标识
      editViewFlag: false,
      editMiniAppFlag: false,
      editMediaFlag: false,
      editArticleFlag: false,

      // 菜单内容类型
      menuTypeOptions: [
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
        { value: 'location_select', label: '弹出地理位置选择器' }
      ]
    }
  },
  methods: {
    /**
     * 删除
     */
    delMenu () {
      this.$emit('delete')
    },
    /**
     * 菜单类型变动
     */
    menuTypeChange (value) {
      this.editViewFlag = false
      this.editMiniAppFlag = false
      this.editMediaFlag = false
      this.editArticleFlag = false
      if (['view'].includes(value)) {
        this.editViewFlag = true
      } else if (['miniprogram'].includes(value)) {
        this.editMiniAppFlag = true
      } else if (['media_id'].includes(value)) {
        this.editMediaFlag = true
      } else if (['article_view_limited', 'article_id'].includes(value)) {
        this.editArticleFlag = true
      } else {
      }
    },
    /**
     * 选择素材
     */
    selectMedia () {
      this.$refs.weChatMediaSelect.show()
    },
    selectMediaCallback (mediaId) {
      // this.menuDetail.mediaId = mediaId
      this.$set(this.menuDetail, 'mediaId', mediaId)
    },
    /**
     * 选择文章
     */
    selectArticle () {
      this.$refs.weChatArticleSelect.init()
    },
    selectArticleCallback (articleId) {
      // this.menuDetail.articleId = articleId
      this.$set(this.menuDetail, 'articleId', articleId)
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
