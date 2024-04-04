import react from '@vitejs/plugin-react'

/** @type {import('vite').UserConfig} */
export default {
  root: './example',
  optimizeDeps: {
    esbuildOptions: {
      jsx: "automatic",
    }
  },
  plugins: [react()],
}