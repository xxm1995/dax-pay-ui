/**
 * 树形数据转换
 * @param data 数据
 * @param value 值名称
 * @param title 标题名称
 * @param children 孩子列表字段名
 * @returns {*[]}
 */
export function treeDataTranslate(data, value = 'value', title = 'title', children = 'children') {
  const temp = [] as unknown[]
  for (let i = 0; i < data.length; i++) {
    const p = {
      key: data[i][value],
      title: data[i][title],
      value: String(data[i][value]),
      children: [],
    } as Tree
    if (data[i][children] && data[i][children].length > 0) {
      p.children = treeDataTranslate(data[i][children], value, title, children)
    }
    temp.push(p)
  }
  return temp
}
interface Tree {
  key: string
  title: string
  value: unknown
  children: undefined | unknown[] | null
}
