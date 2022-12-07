import { getThemeColors, generateColors } from '../../../build/config/themeConfig'

import { replaceStyleVariables } from '@rys-fe/vite-plugin-theme/es/client'
import { mixLighten, mixDarken, tinycolor } from '@rys-fe/vite-plugin-theme/es/colorUtils'

export async function changeTheme(color: string) {
  const colors = generateColors({
    mixDarken,
    mixLighten,
    tinycolor,
    color,
  })

  return await replaceStyleVariables({
    colorVariables: [...getThemeColors(color), ...colors],
  })
}
