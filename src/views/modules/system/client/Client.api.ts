import { defHttp } from '/@/utils/http/axios';

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get({
    url: "/client/page",
    params
  })
}
