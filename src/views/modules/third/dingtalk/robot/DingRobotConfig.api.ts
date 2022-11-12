import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<DingRobotConfig>>>({
    url: '/ding/robot/config/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<DingRobotConfig[]>>({
    url: '/ding/robot/config/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<DingRobotConfig>>({
    url: '/ding/robot/config/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: DingRobotConfig) {
  return defHttp.post({
    url: '/ding/robot/config/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: DingRobotConfig) {
  return defHttp.post({
    url: '/ding/robot/config/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/ding/robot/config/delete',
    params: { id },
  })
}

/**
 * 编码是否被使用
 */
export function existsByCode(code) {
  return defHttp.get<Result<boolean>>({
    url: '/ding/robot/config/existsByCode',
    params: { code },
  })
}

export function existsByCodeNotId(code, id) {
  return defHttp.get<Result<boolean>>({
    url: '/ding/robot/config/existsByCodeNotId',
    method: 'GET',
    params: { code, id },
  })
}

/**
 * 钉钉机器人配置
 */
export interface DingRobotConfig extends BaseEntity {
  // 名称
  name: string
  // 编号
  code: string
  // 钉钉机器人访问token
  accessToken: string
  // 是否开启验签
  enableSignatureCheck: boolean
  // 钉钉机器人私钥
  signSecret: string
  // 备注
  remark: string
}
