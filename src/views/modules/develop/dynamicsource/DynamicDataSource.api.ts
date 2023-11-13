import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity, KeyValue } from '/#/web'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<DynamicDataSource>>>({
    url: '/dynamic/source/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<DynamicDataSource>>({
    url: '/dynamic/source/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: DynamicDataSource) => {
  return defHttp.post({
    url: '/dynamic/source/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: DynamicDataSource) => {
  return defHttp.post({
    url: '/dynamic/source/update',
    data: obj,
  })
}

/**
 * 测试连接
 */
export const testConnection = (obj: DynamicDataSource) => {
  return defHttp.post<Result<string>>({
    url: '/dynamic/source/testConnection',
    data: obj,
  })
}

/**
 * 测试连接
 */
export const testConnectionById = (id) => {
  return defHttp.get<Result<string>>({
    url: '/dynamic/source/testConnectionById',
    params: { id },
  })
}

/**
 * 根据id进行添加到连接池中
 */
export const addDynamicDataSourceById = (id) => {
  return defHttp.post<Result<string>>({
    url: '/dynamic/source/addDynamicDataSourceById',
    params: { id },
  })
}

/**
 * 判断编码是否被使用
 */
export const existsByCode = (id) => {
  return defHttp.get<Result<boolean>>({
    url: '/dynamic/source/existsByCode',
    params: { id },
  })
}

/**
 * 判断编码是否被使用
 */
export const existsByCodeNotId = (code, id) => {
  return defHttp.get<Result<boolean>>({
    url: '/dynamic/source/existsByCodeNotId',
    params: { id, code },
  })
}
/**
 * 判断是否已经添加到连接池中
 */
export const existsByDataSourceKey = (code) => {
  return defHttp.get<Result<boolean>>({
    url: '/dynamic/source/existsByDataSourceKey',
    params: { code },
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/dynamic/source/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<DynamicDataSource>>>({
    url: '/dynamic/source/findAll',
  })
}

/**
 * 查询当前数据源列表
 */
export const findAllDataSource = () => {
  return defHttp.get<Result<KeyValue[]>>({
    url: '/dynamic/source/findAllDataSource',
  })
}

/**
 * 从数据源列表中删除指定数据源
 */
export const removeDataSourceByKey = (key) => {
  return defHttp.delete({
    url: '/dynamic/source/removeDataSourceByKey',
    params: { key },
  })
}

/**
 * 动态数据源管理
 */
export interface DynamicDataSource extends BaseEntity {
  // 数据源编码
  code?: string
  // 数据源名称
  name?: string
  // 数据库类型
  databaseType?: string
  // 驱动类
  dbDriver?: string
  // 数据源地址
  dbUrl?: string
  // 用户名
  dbUsername?: string
  // 密码
  dbPassword?: string
  // 自动加载
  autoLoad?: boolean
  // 备注
  remark?: string
}

/**
 * 数据类型列表
 */
export const databaseTypes = [
  { value: 'mysql', label: 'MySQL' },
  { value: 'oracle', label: 'Oracle' },
  { value: 'mssql', label: 'SQLServer' },
] as LabeledValue[]

/**
 * 数据类型关联信息列表
 */
export // 数据列表
const databaseTypeMap = {
  mysql: {
    dbDriver: 'com.mysql.cj.jdbc.Driver',
    dbUrl:
      'jdbc:mysql://127.0.0.1:3306/bootx?characterEncoding=UTF-8&useUnicode=true&useSSL=false&tinyInt1isBit=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai',
  },
  oracle: {
    dbDriver: 'oracle.jdbc.OracleDriver',
    dbUrl: 'jdbc:oracle:thin:@127.0.0.1:1521:BOOTX',
  },
  mssql: {
    dbDriver: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    dbUrl: 'jdbc:mysql://127.0.0.1:3306/bootx?characterEncoding=UTF-8&useUnicode=true&useSSL=false',
  },
}
