import { TablePageModel } from '/#/web'
import { reactive, toRefs } from 'vue'
import { PageResult } from '/#/axios'

/**
 * 获取数据对象
 */
export default function (queryPageCallback: CallableFunction) {
  // 数据内容
  const model = reactive({
    pages: {
      size: 10,
      current: 1,
    },
    queryParam: {},
    loading: false,
    batchOperateFlag: false,
    superQueryFlag: false,
    pagination: {},
  } as TablePageModel)

  // 拆分
  const { loading, batchOperateFlag, superQueryFlag } = toRefs(model)
  // 不可以被重新赋值, 否则会失去绑定
  const { pages, pagination } = model
  // 普通查询
  function query() {
    model.superQueryFlag = false
    resetPage()
    queryPageCallback()
  }
  // 表格翻页或变动
  function handleTableChange({ currentPage, pageSize }) {
    pages.current = currentPage
    pages.size = pageSize
    queryPageCallback()
  }
  // 重置当前页数
  function resetPage() {
    pages.current = 1
  }
  // 分页查询返回结果处理
  function pageQueryResHandel(res: PageResult) {
    pagination.current = Number(res.current)
    pagination.size = Number(res.size)
    pagination.total = Number(res.total)
    pagination.records = res.records
    model.loading = false
  }
  // 重置查询
  function resetQuery() {
    resetQueryParams()
    queryPageCallback()
  }
  // 重置查询参数
  function resetQueryParams() {
    model.superQueryFlag = false
    model.queryParam = {}
  }
  // ok按钮
  function handleOk() {
    queryPageCallback()
  }

  return {
    model,
    loading,
    pages,
    pagination,
    batchOperateFlag,
    superQueryFlag,
    query,
    resetPage,
    pageQueryResHandel,
    handleTableChange,
    resetQuery,
    resetQueryParams,
    handleOk,
  }
}
