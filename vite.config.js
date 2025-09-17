import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // mode: 현재 Vite가 실행되고 있는 모드
    // process.cwd(): vite 명령어를 실행한 프로젝트의 루트 디렉토리를 의미
    // '' (빈 문자열): 불러올 환경 변수의 접두사를 지정
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            react(),
            tailwindcss()
        ],
        server: {
            port: Number(env.VITE_PORT) || (mode === 'development' && 5173)
        },
        proxy: {
            '/dataGo': {
                target: env.VITE_DATA_GO_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/dataGo/, '')
            }
        }
    }
})
