export enum PageEnum {
  // 登录页
  BASE_LOGIN = '/login',
  // 个人设置
  ACCOUNT_SETTING = '/account/setting',
  // 站内信界面
  SITE_MESSAGE = '/person/siteMessage',
  // 登陆后主页
  BASE_HOME = '/dashboard',
  // 异常页
  ERROR_PAGE = '/exception',
  // 错误日志页面路径
  ERROR_LOG_PAGE = '/error-log/list',
}

export const PageConstant = {
  // 个人修改密码设置路由
  ACCOUNT_PASSWORD: { path: PageEnum.ACCOUNT_SETTING, query: { activeKey: 2 } },
}
