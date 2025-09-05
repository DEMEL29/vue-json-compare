import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/your-repo-name/', // имя вашего репозитория на GitHub
  plugins: [vue()]
});
