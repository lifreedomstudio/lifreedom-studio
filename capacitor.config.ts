import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lifreedomstudio.mixdojo',
  appName: 'MixDojo',
  webDir: 'public', // 👈 改成 'public'，因為這個資料夾絕對存在
  server: {
    url: 'https://lifreedom-studio.vercel.app', // 保持你的 Vercel 網址
    cleartext: true
  }
};

export default config;