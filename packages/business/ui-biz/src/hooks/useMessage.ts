import { $t } from '@vben/locales';

import { App, message, Modal, notification } from 'antdv-next';

/** Modal 静态方法配置类型（confirm / info / warning / error / success 共用） */
type ModalConfig = Parameters<typeof Modal.confirm>[0];

let antdAppContext: null | ReturnType<typeof App.useApp> = null;

/**
 * 设置 antd App 上下文
 */
export function setAntdAppContext(appContext: ReturnType<typeof App.useApp>) {
  antdAppContext = appContext;
}

/**
 * 为确认框注入默认 title / okText / cancelText
 * 调用方显式传入则覆盖；undefined 不冲掉默认值
 */
function withConfirmDefaults(config: ModalConfig): ModalConfig {
  const { title, okText, cancelText, ...rest } = config;
  return {
    ...rest,
    title: title ?? $t('common.prompt'),
    okText: okText ?? $t('common.okText'),
    cancelText: cancelText ?? $t('common.cancelText'),
  };
}

/**
 * 为单按钮结果弹窗注入默认 title / okText
 */
function withAlertDefaults(config: ModalConfig, defaultTitleKey: string): ModalConfig {
  const { title, okText, ...rest } = config;
  return {
    ...rest,
    title: title ?? $t(defaultTitleKey),
    okText: okText ?? $t('common.okText'),
  };
}

/**
 * 统一获取全局消息、通知和确认框能力
 *
 * 弹窗标题约定：
 * - confirm 默认 common.prompt（提示）
 * - info 默认 common.prompt（提示）
 * - warning 默认 common.warning（警告）
 * - error 默认 common.error（错误）
 * - success 默认 common.success（成功）
 * 业务语义强时由调用方显式传 title 覆盖
 */
export function useMessage() {
  // 上下文版实例优先(挂载在 App 上下文内可响应主题), 回退静态实例
  const messageApi = antdAppContext?.message ?? message;

  /**
   * 确认框（二次确认）
   */
  function confirm(config: ModalConfig) {
    const merged = withConfirmDefaults(config);
    if (antdAppContext) {
      return antdAppContext.modal.confirm(merged);
    }
    return Modal.confirm(merged);
  }

  /**
   * 提示信息框
   */
  function info(config: ModalConfig) {
    const merged = withAlertDefaults(config, 'common.prompt');
    if (antdAppContext) {
      return antdAppContext.modal.info(merged);
    }
    return Modal.info(merged);
  }

  /**
   * 警告信息框
   */
  function warning(config: ModalConfig) {
    const merged = withAlertDefaults(config, 'common.warning');
    if (antdAppContext) {
      return antdAppContext.modal.warning(merged);
    }
    return Modal.warning(merged);
  }

  /**
   * 错误信息框
   */
  function error(config: ModalConfig) {
    const merged = withAlertDefaults(config, 'common.error');
    if (antdAppContext) {
      return antdAppContext.modal.error(merged);
    }
    return Modal.error(merged);
  }

  /**
   * 成功信息框
   */
  function success(config: ModalConfig) {
    const merged = withAlertDefaults(config, 'common.success');
    if (antdAppContext) {
      return antdAppContext.modal.success(merged);
    }
    return Modal.success(merged);
  }

  /**
   * 操作确认: 确认弹窗 + 执行动作 + 成功提示 + 后续回调的常用四件套
   *
   * 收敛列表页"确认后调接口 → message.success → 刷新列表"的复制样板;
   * 动作抛错时请求层拦截器已全局提示, 成功消息与回调不会执行。
   *
   * @param config    确认框文案(title/content), 其余 Modal 参数透传
   * @param action    确认后执行的操作
   * @param options.successKey 成功提示词条(默认 common.saveSuccess, 删除场景传 common.deleteSuccess)
   * @param options.onSuccess  成功后的回调(如刷新列表)
   */
  function confirmAction(
    config: Partial<ModalConfig> & { content: ModalConfig['content']; title?: ModalConfig['title'] },
    action: () => Promise<unknown>,
    options: { onSuccess?: () => void; successKey?: string } = {},
  ) {
    const { successKey = 'common.saveSuccess', onSuccess } = options;
    confirm({
      ...config,
      onOk: async () => {
        await action();
        messageApi.success($t(successKey));
        onSuccess?.();
      },
    });
  }

  return {
    confirm,
    confirmAction,
    info,
    warning,
    error,
    success,
    message: messageApi,
    notification: antdAppContext?.notification ?? notification,
  };
}
