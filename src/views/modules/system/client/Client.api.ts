import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult>>({
    url: '/client/page',
    params,
  })
}

/**
 * 实体类
 */
// export class Client extends BaseEntity {
//   // 编码
//   public code: string
//   // 名称
//   name: string
//   // 是否系统内置
//   system: boolean
//   // 是否可用
//   enable: boolean
//   // 关联登录方式
//   loginTypeIds: string
//   // 关联登录方式
//   loginTypeIdList: Array<number>
//   // 描述
//   description: string
// }
