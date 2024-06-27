import BaseSetting from './BaseSetting.vue'
import SecureSetting from '../security/SecureSetting.vue'

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
]
