import { FormEditType } from '/@/enums/formTypeEnum'
import { unref } from 'vue'

/**
 * 服务器校验
 */
async function existsByServer(value, id, formEditType, existsFun, existsNotIdFun, errMsg = '该编码已存在!') {
  if (!value) {
    return Promise.resolve()
  }
  const res = unref(formEditType) === FormEditType.Edit ? await existsNotIdFun(value, id) : await existsFun(value)
  return res.data ? Promise.reject(errMsg) : Promise.resolve()
}

export function useValidate() {
  return {
    existsByServer,
  }
}
