import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 树
 */
export function tree() {
  return defHttp.get<Result<DeptTree[]>>({
    url: '/dept/tree',
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<Array<Dept>>>({
    url: '/dept/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<Dept>>({
    url: '/dept/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: Dept) {
  return defHttp.post({
    url: '/dept/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: Dept) {
  return defHttp.post({
    url: '/dept/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/dept/delete',
    params: { id },
  })
}

/**
 * 部门组织机构表
 */
export interface Dept extends BaseEntity {
  // 父机构ID
  parentId?: string | null
  // 机构/部门名称
  deptName: string
  // 排序
  sortNo: number
  // 机构类别 1公司 2部门 3岗位
  orgCategory: number
  // 机构编码
  orgCode: string
  // 手机号
  mobile: string
  // 传真
  fax: string
  // 地址
  address: string
  // 备注
  remark: string
}

/**
 * 部门树
 */
export interface DeptTree extends Dept {
  children: DeptTree[]
}
