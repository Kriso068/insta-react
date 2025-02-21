// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: "./",
//   server: {
//     host: true,
//   },
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Add this section for handling SPA fallback
  define: {
    'process.env': {}
  },
  base: "/", // Change this to `/` instead of `./`
});
