<script lang="tsx">
  import type { PropType } from 'vue'
  import { Result, Button } from 'ant-design-vue'
  import { defineComponent, ref, computed, unref } from 'vue'
  import { ExceptionEnum } from '@/enums/exceptionEnum'
  import notDataSvg from '@/assets/svg/no-data.svg'
  import netWorkSvg from '@/assets/svg/net-error.svg'
  import { useRoute } from 'vue-router'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useGo, useRedo } from '@/hooks/web/usePage'
  import { PageEnum } from '@/enums/pageEnum'

  interface MapValue {
    title: string
    subTitle: string
    btnText?: string
    icon?: string
    handler?: any
    status?: string
  }

  export default defineComponent({
    name: 'ErrorPage',
    props: {
      // 状态码
      status: {
        type: Number as PropType<number>,
        default: ExceptionEnum.PAGE_NOT_FOUND,
      },

      title: {
        type: String as PropType<string>,
        default: '',
      },

      subTitle: {
        type: String as PropType<string>,
        default: '',
      },

      full: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
    },
    setup(props) {
      const statusMapRef = ref(new Map<string | number, MapValue>())

      const { query } = useRoute()
      const go = useGo()
      const redo = useRedo()
      const { prefixCls } = useDesign('app-exception-page')

      const getStatus = computed(() => {
        const { status: routeStatus } = query
        const { status } = props
        return Number(routeStatus) || status
      })

      const getMapValue = computed((): MapValue => {
        return unref(statusMapRef).get(unref(getStatus)) as MapValue
      })

      const backLogin = '返回登录'
      const backHome = '返回首页'

      unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_ACCESS, {
        title: '403',
        status: `${ExceptionEnum.PAGE_NOT_ACCESS}`,
        subTitle: '抱歉，您无权访问此页面。',
        btnText: props.full ? backLogin : backHome,
        handler: () => (props.full ? go(PageEnum.BASE_LOGIN) : go()),
      })

      unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_FOUND, {
        title: '404',
        status: `${ExceptionEnum.PAGE_NOT_FOUND}`,
        subTitle: '抱歉，您访问的页面不存在。',
        btnText: props.full ? backLogin : backHome,
        handler: () => (props.full ? go(PageEnum.BASE_LOGIN) : go()),
      })

      unref(statusMapRef).set(ExceptionEnum.ERROR, {
        title: '500',
        status: `${ExceptionEnum.ERROR}`,
        subTitle: '抱歉，服务器报告错误。',
        btnText: backHome,
        handler: () => go(),
      })

      unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_DATA, {
        title: '当前页无数据',
        subTitle: '',
        btnText: '刷新',
        handler: () => redo(),
        icon: notDataSvg,
      })

      unref(statusMapRef).set(ExceptionEnum.NET_WORK_ERROR, {
        title: '网络错误',
        subTitle: '抱歉，您的网络连接已断开，请检查您的网络！',
        btnText: '刷新',
        handler: () => redo(),
        icon: netWorkSvg,
      })

      return () => {
        const { title, subTitle, btnText, icon, handler, status } = unref(getMapValue) || {}
        return (
          <Result
            class={prefixCls}
            status={status as any}
            title={props.title || title}
            sub-title={props.subTitle || subTitle}
          >
            {{
              extra: () =>
                btnText && (
                  <Button type="primary" onClick={handler}>
                    {() => btnText}
                  </Button>
                ),
              // antv 原来支持 status 可选： success | error | info | warning | 404 | 403 | 500
              // 上面 ExceptionEnum 覆盖了 404 | 403 | 500，并增加其他状态值
              // 增加下面判断，继续支持 success | error | info | warning
              icon:
                status && ExceptionEnum[status] === void 0
                  ? () => (icon ? <img src={icon} /> : null)
                  : undefined,
            }}
          </Result>
        )
      }
    },
  })
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-app-exception-page';

  .@{prefix-cls} {
    display: flex;
    flex-direction: column;
    align-items: center;

    .ant-result-icon {
      img {
        max-width: 400px;
        max-height: 300px;
      }
    }
  }
</style>
