import { defineStore } from 'pinia'
import { FilePlatform } from '#/store'
import { findAll } from '@/views/baseapi/file/platform/FilePlatform.api'

interface FilePlatformState {
  filePlatform: FilePlatform[]
}
export const useFilePlatformStore = defineStore({
  id: 'app-file-platform',
  state: (): FilePlatformState => ({
    filePlatform: [],
  }),
  getters: {
    getFilePlatforms(): FilePlatform[] {
      return this.filePlatform
    },
  },
  actions: {
    /**
     * 初始化存储平台, 并列表
     */
    async initFilePlatform() {
      const { data } = await findAll()
      this.filePlatform = data.map((o) => {
        return {
          type: o.type,
          url: o.url,
          defaultPlatform: o.defaultPlatform,
        } as FilePlatform
      })
      console.log('初始化存储平台')
      return this.filePlatform
    },
  },
})
