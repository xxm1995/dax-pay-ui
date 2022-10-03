import { PageParams } from '/#/web'

/**
 * 重置当前页数
 */
export function resetPage(pages: PageParams) {
  pages.current = 1
}
