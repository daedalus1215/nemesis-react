import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { env } from './vite.env.config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [env.VITE_ALLOWED_HOSTS],
  },
})
