import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { type PluginOption } from 'vite'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import purgeIcons from 'vite-plugin-purge-icons'
import DevTools from 'vite-plugin-vue-devtools'

import { createAppConfigPlugin } from './appConfig'
import { configCompressPlugin } from './compress'
import { configHtmlPlugin } from './html'
import { configSvgIconsPlugin } from './svgSprite'
import { configVisualizerConfig } from './visualizer'

interface Options {
  isBuild: boolean
  root: string
  compress: string
  enableAnalyze?: boolean
}

async function createPlugins({ isBuild, root, compress, enableAnalyze }: Options) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [vue(), vueJsx()]

  const appConfigPlugin = await createAppConfigPlugin({ root, isBuild })
  vitePlugins.push(appConfigPlugin)

  vitePlugins.push(DevTools())

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin({ isBuild }))

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin({ isBuild }))

  // vite-plugin-purge-icons
  vitePlugins.push(purgeIcons())

  // The following plugins only work in the production environment
  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin({
        compress,
      }),
    )
  }

  // rollup-plugin-visualizer
  if (enableAnalyze) {
    vitePlugins.push(configVisualizerConfig())
  }

  return vitePlugins
}

export { createPlugins }
