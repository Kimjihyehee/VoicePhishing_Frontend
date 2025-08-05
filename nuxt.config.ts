// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { resolve } from "path";

// 환경변수 설정
process.env.VITE_ENV_TYPE ||= "development";

// 항상 공통 .env 먼저 로드
config({ path: resolve(__dirname, ".env") });

// 그 다음 VITE_ENV_TYPE에 따라 병합 (.env.development 등)
config({ path: resolve(__dirname, `.env.${process.env.VITE_ENV_TYPE}`) });

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  target: "static",

  // router 설정
  router: {
    options: {
      strict: false, // strict 모드를 비활성화
    },
  },

  // CSS 설정
  css: [
    "~/assets/css/main.scss",
  ],

  // 모듈 설정
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt'
  ],

  // Nitro 프록시 설정 (Nuxt 내장)
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8080/api',
        changeOrigin: true,
      }
    }
  },

  // 컴포넌트 자동 import 설정
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  // 별칭 설정
  alias: {
    "@extends": fileURLToPath(
      new URL("./components/common/extends", import.meta.url),
    ),
    "@base": fileURLToPath(
      new URL("./components/common/base", import.meta.url),
    ),
    "@assets": fileURLToPath(new URL("./assets", import.meta.url)),
    "@common": fileURLToPath(new URL("./components/common", import.meta.url)),
    "@": fileURLToPath(new URL("./", import.meta.url)),
    "@assetsPublic": fileURLToPath(new URL("./assets", import.meta.url)),
  },



  // Pinia 설정
  pinia: {
    autoImports: [
      "defineStore", // import { defineStore } from 'pinia'
      ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },

  // 앱 설정
  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { hid: "description", name: "description", content: "보이스피싱 신고 시스템" },
        { charset: "utf-8" },
      ],
      link: [
        {
          rel: "stylesheet",
          as: "style",
          crossorigin: "anonymous",
          href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css",
        },
      ],
    },
  },

  // Vite 설정 (SCSS 전처리기 포함)
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // @use 구문을 사용하므로 additionalData는 제거
          // 각 파일에서 필요한 모듈을 직접 import
        }
      }
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  },

  // 빌드 설정
  build: {
    transpile: ["quasar"],
  },

  compatibility: {
    date: "2025-04-16",
  },
})