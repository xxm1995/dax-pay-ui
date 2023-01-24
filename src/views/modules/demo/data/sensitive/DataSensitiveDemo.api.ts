import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<DataSensitiveDemo>>>({
    url: '/demo/data/sensitive/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<DataSensitiveDemo[]>>({
    url: '/demo/data/sensitive/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<DataSensitiveDemo>>({
    url: '/demo/data/sensitive/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: DataSensitiveDemo) {
  return defHttp.post({
    url: '/demo/data/sensitive/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: DataSensitiveDemo) {
  return defHttp.post({
    url: '/demo/data/sensitive/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/demo/data/sensitive/delete',
    params: { id },
  })
}

/**
 * 数据脱敏演示
 */
export interface DataSensitiveDemo extends BaseEntity {
  // 中文名字
  chineseName?: string
  // 密码
  password?: string
  // 身份证号
  idCard?: string
  // 手机号
  mobilePhone?: string
  // 车牌号
  carLicense?: string
  // 电子邮件
  email?: string
  // 其他
  other?: string
}
