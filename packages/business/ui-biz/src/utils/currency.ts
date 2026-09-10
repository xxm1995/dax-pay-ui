import { $t } from '@vben/locales';

/**
 * 币种展示名
 *
 * 对齐后端 CurrencyEnum(ISO 4217 三位字母码, 库内小写), 文案取字典 currency
 * (apps/{admin,merchant} 的 locales/langs/<locale>/dict.json 的 currency 分组), 缺失映射时回退原始编码。
 */
export function currencyLabel(code?: string): string {
  if (!code) return '-';
  const i18nKey = `dict.currency.${code.toLowerCase()}`;
  const text = $t(i18nKey);
  return text && text !== i18nKey ? text : code;
}
