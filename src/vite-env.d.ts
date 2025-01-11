/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BINANCE_API_URL: string
  readonly VITE_BINANCE_WS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}