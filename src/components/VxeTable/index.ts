import { withInstall } from '@/utils'
import vxeBasicTable from './src/VxeBasicTable'
import './src/setting'

export const VxeBasicTable = withInstall(vxeBasicTable)
export * from 'vxe-table'
export * from './src/types'
