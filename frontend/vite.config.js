import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  define: {
    // Ensure environment variables are properly handled
    __SUPABASE_URL__: JSON.stringify(process.env.VITE_SUPABASE_URL),
    __SUPABASE_KEY__: JSON.stringify(process.env.VITE_SUPABASE_PUBLISHABLE_KEY)
  }
})
