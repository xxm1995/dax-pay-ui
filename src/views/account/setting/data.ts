import { FormSchema } from '/@/components/Form'
import BaseSetting from './BaseSetting.vue'
import SecureSetting from '../security/SecureSetting.vue'
import AccountBind from '../bind/AccountBind.vue'
import MsgNotify from './MsgNotify.vue'

export interface ListItem {
  key: string
  title: string
  description: string
  extra?: string
  avatar?: string
  color?: string
}

// tab的list
export const settingList = [
  {
    key: '1',
    name: '基本设置',
    component: BaseSetting,
  },
  {
    key: '2',
    name: '安全设置',
    component: SecureSetting,
  },
  {
    key: '3',
    name: '账号绑定',
    component: AccountBind,
  },
]

// 新消息通知 list
export const msgNotifyList: ListItem[] = [
  {
    key: '1',
    title: '账户密码',
    description: '其他用户的消息将以站内信的形式通知',
  },
  {
    key: '2',
    title: '系统消息',
    description: '系统消息将以站内信的形式通知',
  },
  {
    key: '3',
    title: '待办任务',
    description: '待办任务将以站内信的形式通知',
  },
]
