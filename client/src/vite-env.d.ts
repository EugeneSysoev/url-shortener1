// client/src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_API_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}