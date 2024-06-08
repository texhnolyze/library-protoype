import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['flex-container', 'flex flex-row flex-wrap w-full max-w-screen-md'],
    [
      'btn',
      'px-4 py-1 rounded inline-block cursor-pointer !outline-none disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    ],
    ['basis-half-gap-lg', 'basis-[calc(50% - 1.125rem)]'],
    ['def-btn', 'bg-blue-500 text-white hover:bg-blue-600'],
    ['add-btn', 'bg-green-500 text-white hover:bg-green-600'],
    ['remove-btn', 'bg-red-500 text-white hover:bg-red-600'],
    [
      'icon-btn',
      'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600',
    ],
    ['form-row', 'w-full flex gap-lg items-center mb-4'],
    [
      'input-field',
      'w-full px-4 py-2 border border-gray-300 rounded gray-200 dark:gray-700 background-200 dark:background-700 focus:outline-none focus:border-blue-500',
    ],
    [
      'input-label',
      'mb-1 block text-md text-right uppercase fw-black text-gray-500 dark:text-gray-400',
    ],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
})
