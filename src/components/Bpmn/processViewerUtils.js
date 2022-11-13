import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg'
import { query as domQuery } from 'min-dom'

/**
 * 添加箭头
 */
export function addArrow () {
  const todo = svgCreate('marker')
  // 追加箭头svg元素 通过
  svgAttr(todo, {
    id: 'todo-arrow',
    viewBox: '0 0 20 20',
    refX: '11',
    refY: '10',
    markerWidth: '10',
    markerHeight: '10',
    orient: 'auto'
  })
  const todoPath = svgCreate('path')
  svgAttr(todoPath, {
    d: 'M 1 5 L 11 10 L 1 15 Z',
    class: 'highlight-todo-arrow'
  })
  svgAppend(todo, todoPath)
  // 追加箭头svg元素 通过
  const pass = svgCreate('marker')
  svgAttr(pass, {
    id: 'pass-arrow',
    viewBox: '0 0 20 20',
    refX: '11',
    refY: '10',
    markerWidth: '10',
    markerHeight: '10',
    orient: 'auto'
  })
  const passPath = svgCreate('path')
  svgAttr(passPath, {
    d: 'M 1 5 L 11 10 L 1 15 Z',
    class: 'highlight-pass-arrow'
  })
  svgAppend(pass, passPath)

  // 追加箭头svg元素 驳回
  const reject = svgCreate('marker')
  svgAttr(reject, {
    id: 'reject-arrow',
    viewBox: '0 0 20 20',
    refX: '11',
    refY: '10',
    markerWidth: '10',
    markerHeight: '10',
    orient: 'auto'
  })
  const rejectPath = svgCreate('path')
  svgAttr(rejectPath, {
    d: 'M 1 5 L 11 10 L 1 15 Z',
    class: 'highlight-reject-arrow'
  })
  svgAppend(reject, rejectPath)

  // 追加箭头svg元素 取消
  const cancel = svgCreate('marker')
  svgAttr(cancel, {
    id: 'cancel-arrow',
    viewBox: '0 0 20 20',
    refX: '11',
    refY: '10',
    markerWidth: '10',
    markerHeight: '10',
    orient: 'auto'
  })
  const cancelPath = svgCreate('path')
  svgAttr(cancelPath, {
    d: 'M 1 5 L 11 10 L 1 15 Z',
    class: 'highlight-cancel-arrow'
  })
  svgAppend(cancel, cancelPath)

  const defs = domQuery('defs')
  svgAppend(defs, todo)
  svgAppend(defs, pass)
  svgAppend(defs, cancel)
  svgAppend(defs, reject)
}
