import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/vue-json-compare/', // имя вашего репозитория на GitHub
  plugins: [vue()]
});
