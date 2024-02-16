# Dax-Pay-UI

## 🍈项目介绍

> DaxPay是一套基于Bootx-Platform脚手架构建的一套开源支付网关系统，已经对接支付宝、微信支付相关的接口，以及扩展了钱包支付、储值卡支付、现金支付等新的支付方式。
> 可以独立部署，提供接口供业务系统进行调用，不对原有系统产生影响

## 🍒 文档和源码地址
### 文档地址
在 [Bootx开源文档站](https://bootx.gitee.io/) 下的支付网关(DaxPay)模块下可以进行查阅相关文档，具体链接地址如下：
[快速指南](https://bootx.gitee.io/daxpay/guides/overview/项目介绍.html)、
[支付对接](https://bootx.gitee.io/daxpay/gateway/overview/接口清单.html)、
[平台配置](https://bootx.gitee.io/daxpay/admin/config/平台配置.html)

### 项目地址

| 项目      | GITEE                                       | GITHUB                                          |
|---------|---------------------------------------------|-------------------------------------------------|
| 后端地址    | [GITEE](https://gitee.com/bootx/dax-pay)    | [GITHUB](https://github.com/xxm1995/dax-pay)    |
| Web前端地址 | [GITEE](https://gitee.com/bootx/dax-pay-ui) | [GITHUB](https://github.com/xxm1995/dax-pay-ui) |
| H5前端地址  | [GITEE](https://gitee.com/bootx/dax-pay-h5) | [GITHUB](https://github.com/xxm1995/dax-pay-h5) |


## 🏬 系统演示
### 管理平台:
> 注：演示账号部分功能修改删除权限未开放。

地址：https://daxpay.demo.bootx.cn

账号：daxpay

密码：123456

### 网关接口
> 注：接口平台只开放支付网关相关的接口，不开放系统其他接口。

地址: https://daxpay.server.bootx.cn/doc.html

账号: daxpay

密码: 123456

### 收银台演示
> 请勿大额支付，可以通过后台管理端进行退款

电脑收银台地址: https://daxpay.demo.bootx.cn/#/cashier

手机收银台地址: https://daxpay.demo.bootx.cn/h5/#/cashier/uniCashier

## 项目启动
```shell
# 安装项目依赖, 请使用Node16及以上版本
pnpm install
# 启动项目
pnpm run dev
# 构建打包
pnpm build
```

## 常见问题
出现以下错误不用管，不影响使用，只在第一次启动时出现，之后就不会再出现
```shell
 ERROR  Error: The following dependencies are imported but could not be resolved:                                                                                         10:06:39

  @vue-macros/reactivity-transform/macros (imported by C:/bootx/dax-pay-ui/src/components/Bootx/SuperQuery/SuperQueryItem.vue?id=0)

Are they installed?
    at file:///C:/bootx/dax-pay-ui/node_modules/.pnpm/vite@4.3.5_jmirrwlmbumocpj2mhzxorzq7e/node_modules/vite/dist/node/chunks/dep-934dbc7c.js:44152:23
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async file:///C:/bootx/dax-pay-ui/node_modules/.pnpm/vite@4.3.5_jmirrwlmbumocpj2mhzxorzq7e/node_modules/vite/dist/node/chunks/dep-934dbc7c.js:43561:38

```
