import { TablePageModel } from '/#/web'
import { reactive, ref } from 'vue'
import { PageResult } from '/#/axios'

/**
 * 获取数据对象
 */
export default function <T>(queryPageCallback: CallableFunction) {
  // 数据内容
  const model = reactive({
    pages: {
      size: 10,
      current: 1,
    },
    queryParam: {},
    pagination: {},
  } as TablePageModel<T>)

  // 加载状态
  const loading = ref(false)
  // 批量操作标识
  const batchOperateFlag = ref(false)
  // 超级查询条件生效状态
  const superQueryFlag = ref(false)
  // 排序条件
  const sortParam = reactive({
    sortField: null,
    asc: false,
  })
  // 不可以被重新赋值, 否则会失去绑定
  const { pages, pagination } = model
  /**
   * 普通查询
   */
  function query() {
    superQueryFlag.value = false
    batchOperateFlag.value = false
    resetPage()
    queryPageCallback()
  }
  /**
   * 表格翻页或变动
   */
  function handleTableChange({ currentPage, pageSize }) {
    batchOperateFlag.value = false
    pages.current = currentPage
    pages.size = pageSize
    queryPageCallback()
  }
  /**
   * 排序条件变动
   */
  function sortChange({ order, property }) {
    sortParam.sortField = order ? property : null
    sortParam.asc = order === 'asc'
    queryPageCallback()
  }
  /**
   * 重置当前页数
   */
  function resetPage() {
    pages.current = 1
  }
  /**
   * 分页查询返回结果处理
   */
  function pageQueryResHandel(res: PageResult) {
    pagination.current = Number(res.current)
    pagination.size = Number(res.size)
    pagination.total = Number(res.total)
    pagination.records = res.records
    loading.value = false
  }
  /**
   * 重置查询
   */
  function resetQuery() {
    resetQueryParams()
    queryPageCallback()
  }
  /**
   * 重置查询参数
   */
  function resetQueryParams() {
    superQueryFlag.value = false
    model.queryParam = {}
  }
  /**
   * ok按钮
   */
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
    sortParam,
    query,
    sortChange,
    resetPage,
    pageQueryResHandel,
    handleTableChange,
    resetQuery,
    resetQueryParams,
    handleOk,
  }
}
