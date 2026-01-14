import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
// import { nitro } from 'nitro/vite' // Removed: Conflicts with TanStack Start
import { neon } from './neon-vite-plugin.ts'
import contentCollections from '@content-collections/vite'

const config = defineConfig({
  plugins: [
    devtools(),
    // nitro(), // Removed: Causes 404 for /@tanstack-start/styles.css
    neon,
    contentCollections(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
