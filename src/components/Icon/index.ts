import icon from './src/Icon.vue'
import SvgIcon from './src/SvgIcon.vue'
import IconPicker from './src/IconPicker.vue'
import { withInstall } from '/@/utils'

export { IconPicker, SvgIcon }
export const Icon = withInstall(icon)
export default Icon
