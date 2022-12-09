import { defineStore } from 'pinia'
import { findAllByEnable } from '/@/views/modules/system/dict/DictItem.api'
import { Dict } from '/#/store'
import { store } from '/@/store'

interface DictState {
  dict: Dict[]
}
export const useDictStore = defineStore({
  id: 'app-dict',
  state: (): DictState => ({
    dict: [],
  }),
  getters: {
    getDict(): Dict[] {
      return this.dict
    },
  },
  actions: {
    initDict() {
      findAllByEnable().then(({ data }) => {
        this.dict = data.map((o) => {
          return {
            dictCode: o.dictCode,
            code: o.code,
            name: o.name,
          } as Dict
        })
        console.log('初始化字典')
      })
    },
  },
})
// Need to be used outside the setup
export function useDictStoreWithOut() {
  return useDictStore(store)
}

// 初始化字典
useDictStoreWithOut().initDict()
