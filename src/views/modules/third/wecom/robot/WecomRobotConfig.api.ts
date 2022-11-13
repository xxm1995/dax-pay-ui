import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<WecomRobotConfig>>>({
    url: '/wecom/robot/config/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<WecomRobotConfig[]>>({
    url: '/wecom/robot/config/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<WecomRobotConfig>>({
    url: '/wecom/robot/config/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: WecomRobotConfig) {
  return defHttp.post({
    url: '/wecom/robot/config/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: WecomRobotConfig) {
  return defHttp.post({
    url: '/wecom/robot/config/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/wecom/robot/config/delete',
    params: { id },
  })
}

/**
 * 编码是否被使用
 */
export function existsByCode(code) {
  return defHttp.get<Result<boolean>>({
    url: '/wecom/robot/config/existsByCode',
    params: { code },
  })
}
export function existsByCodeNotId(code, id) {
  return defHttp.get<Result<boolean>>({
    url: '/wecom/robot/config/existsByCodeNotId',
    params: { code, id },
  })
}

/**
 * 企业微信机器人配置
 */
export interface WecomRobotConfig extends BaseEntity {
  // 名称
  name: string
  // 编号
  code: string
  // webhook地址的key值
  webhookKey: string
  // 备注
  remark: string
}
