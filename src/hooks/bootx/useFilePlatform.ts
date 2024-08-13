import { FilePlatform } from '#/store'
import { useFilePlatformStore } from '@/store/modules/filePlatform'

const platformStore = useFilePlatformStore()

/**
 * 获取存储平台列表
 */
async function getFilePlatforms(): Promise<FilePlatform[]> {
  const filePlatform = platformStore.getFilePlatforms
  if (filePlatform.length > 0) {
    return filePlatform
  } else {
    return await platformStore.initFilePlatform()
  }
}

/**
 * 获取地址
 * @param fileUrl 文件保存的url地址
 * @param platform 存储平台类型编码
 */
function getFileUrl(fileUrl?: string, platform?: string) {
  const platforms = platformStore.getFilePlatforms
  const item = platforms.filter((o) => {
    return platform ? platform === o.type : o.defaultPlatform
  })
  if (item && item.length > 0) {
    return item[0].url + fileUrl
  } else {
    return ''
  }
}

/**
 * 存储平台hooks
 */
export function useFilePlatform() {
  // 初始化
  getFilePlatforms().then()
  return {
    getFileUrl,
  }
}
