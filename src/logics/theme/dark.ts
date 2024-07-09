import { addClass, hasClass, removeClass } from '@/utils/domUtils'
import { setDark } from '@/components/VxeTable'


export type CustomColorType = {
  name: string
  light: string
  dark: string
}

export async function updateDarkTheme(mode: string | null = 'light') {
  const htmlRoot = document.getElementById('htmlRoot')
  if (!htmlRoot) {
    return
  }
  const hasDarkClass = hasClass(htmlRoot, 'dark')
  if (mode === 'dark') {
    setDark(true)
    htmlRoot.setAttribute('data-theme', 'dark')
    if (!hasDarkClass) {
      addClass(htmlRoot, 'dark')
    }
  } else {
    setDark(false)
    htmlRoot.setAttribute('data-theme', 'light')
    if (hasDarkClass) {
      removeClass(htmlRoot, 'dark')
    }
  }
}
