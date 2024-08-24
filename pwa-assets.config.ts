import {
    defineConfig,
    Preset,
    minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
    headLinkOptions: {
        preset: '2023',
    },
    preset,
    images: ['public/favicon.png'],
})

export const minimal2023Preset: Preset = {
    transparent: {
      sizes: [],//sizes: [64, 192, 512],
      favicons: [[192, 'favicon.png']]
    },
    maskable: {
      sizes: []
    },
    apple: {
      sizes: [180]
    }
  }