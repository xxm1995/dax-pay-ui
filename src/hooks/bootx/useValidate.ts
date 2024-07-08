import { FormEditType } from '@/enums/formTypeEnum'
import { unref } from 'vue'

/**
 * 服务器校验
 * @param value 要进行查重的值
 * @param id 主键
 * @param formEditType 方法类型，新增或更新
 * @param existsFun 查询该值的记录是否存在的请求方法
 * @param existsNotIdFun 查询该值id对应的数据之外否存在记录是的请求方法
 * @param errMsg 验证不通过的内容
 */
async function existsByServer(
  value,
  id,
  formEditType,
  existsFun,
  existsNotIdFun,
  errMsg = '该编码已存在!',
) {
  if (!value) {
    return Promise.resolve()
  }
  const res =
    unref(formEditType) === FormEditType.Edit
      ? await existsNotIdFun(value, id)
      : await existsFun(value)
  return res.data ? Promise.reject(errMsg) : Promise.resolve()
}

export function useValidate() {
  return {
    existsByServer,
  }
}
